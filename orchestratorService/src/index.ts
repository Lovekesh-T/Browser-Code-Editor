import express from "express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import cors from "cors";
import { KubeConfig, AppsV1Api, CoreV1Api, NetworkingV1Api } from "@kubernetes/client-node";

const app = express();
app.use(express.json());
app.use(cors());

const kubeconfig = new KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);

// Updated utility function to handle multi-document YAML files
const readAndParseKubeYaml = (filePath: string, replId: string): Array<any> => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
        let docString = doc.toString();
        const regex = new RegExp(`service_name`, 'g');
        const replRegex = new RegExp(`replId`, 'g');
        const usernameRegex = new RegExp(`username`, 'g');
        docString = docString.replace(regex, replId);
        docString = docString.replace(replRegex, replId.split("-").slice(1).join("-"));
        docString = docString.replace(usernameRegex, replId.split("-")[0]);
        console.log(docString);
        return yaml.parse(docString);
    });
    return docs;
};


const deleteResources = async (resourceName:string)=>{
    const namespace = "default"
     try {
         
        await appsV1Api.deleteNamespacedDeployment(resourceName,namespace);
        await coreV1Api.deleteNamespacedService(resourceName,namespace);
        await networkingV1Api.deleteNamespacedIngress(resourceName,namespace);
        
     } catch (error) {
        console.log(error)
     }
}

app.post("/start", async (req, res) => {
    const { username, replId } = req.body; // Assume a unique identifier for each user
    const namespace = "default"; // Assuming a default namespace, adjust as needed

    try {
        const kubeManifests = readAndParseKubeYaml(path.join(__dirname, "../service.yaml"), `${username}-${replId}`);
        for (const manifest of kubeManifests) {
            switch (manifest.kind) {
                case "Deployment":
                    await appsV1Api.createNamespacedDeployment(namespace, manifest);
                    break;
                case "Service":
                    await coreV1Api.createNamespacedService(namespace, manifest);
                    break;
                case "Ingress":
                    await networkingV1Api.createNamespacedIngress(namespace, manifest);
                    break;
                default:
                    console.log(`Unsupported kind: ${manifest.kind}`);
            }
        }
        res.status(200).send({ message: "Resources created successfully" });
    } catch (error) {
        console.error("Failed to create resources", error);
        res.status(500).send({ message: "Failed to create resources" });
    }
});


app.post("/delete", async (req,res)=>{
    const {replId,username} = req.body;
   try {
     await deleteResources(`${username}-${replId}`);
     res.status(200).json({message:"resource terminated successfully"})
   } catch (error) {
    res.status(500).json({message:"Internal server error"})
   }
  
})

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
