# Browser Code Editor

## Prerequisites
- [Node.js](https://nodejs.org/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [Docker](https://docs.docker.com/get-docker/)
- [Dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html)

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Lovekesh-T/Browser-Code-Editor.git
cd <repository-directory>
```

### 2. Install dependencies for each service
```bash
npm install
```

### 3. Assuming you have kind installed in your system, create a cluster.yml file and paste this configuration
```yml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"        
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
        protocol: TCP
      - containerPort: 443
        hostPort: 443
        protocol: TCP
```

### 4. Run command to create kubernetes cluster 
```bash
kind create cluster --config cluster.yml ---name <cluster-name>
```

### 5. After cluster is created, We have to bring up ingress controller in our nodes by running command:-
```bash
kubectl apply --filename https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
```

### 6. Configure Dnsmasq
Create or edit the `dnsmasq` configuration file. On most systems, this file is located at `/etc/dnsmasq.conf`. Add the following configuration (you can put your desired domain but then dont' forget to change the yml file in orchestrater service with configured domain ) to set up DNS resolution for your local cluster:
```conf
# Dnsmasq configuration for local Kubernetes cluster
address=/cloudid.com/127.0.0.1
address=/runner.com/127.0.0.1
```

### 7. Start backend, orchestrater and frontend service.

## Here is the demo of project
https://github.com/user-attachments/assets/7145039d-80ff-42e9-946c-fb47927957d3


