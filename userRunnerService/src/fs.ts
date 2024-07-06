import fs from "fs";
import path from "path";

interface File {
  type: "file" | "dir";
  name: string;
  path: string;
}

export const fetchDir = (dir: string, baseDir: string): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          files.map((file) => ({
            type: file.isDirectory() ? "dir" : "file",
            name: file.name,
            path: `${baseDir}/${file.name}`,
          }))
        );
      }
    });
  });
};

export const fetchFileContent = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const saveFile = async (
  file: string,
  content: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, "utf8", (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const createFile = ({
  type,
  path,
}: {
  type: string;
  path: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (type === "dir") {
      fs.mkdir(path, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    } else {
      fs.writeFile(path, "", (err) => {
        if (err) return reject(err);
        resolve();
      });
    }
  });
};


export const deleteFile  = (path:string):Promise<void>=>{
     return new Promise((resolve,reject)=>{     
      fs.unlink(path,(err)=>{
        if(err) reject(err);
        else resolve()
      })
     })
}



export const deleteFolderRecursive = (dirPath:string)=>{
      try {
         if(fs.existsSync(dirPath)){
          fs.readdirSync(dirPath,{withFileTypes:true}).forEach((file)=>{
            if(file.isDirectory()){
            const folderPath = path.join(dirPath,file.name);
               deleteFolderRecursive(folderPath);

            }else{
              const filepath = path.join(dirPath,file.name)
              fs.unlinkSync(filepath);
            }
          })

          fs.rmdirSync(dirPath);

         }else{
          console.log("folder does n't exist")
         }
        
      } catch (error) {
         throw error
      }
}

export const renameFile = (oldpath:string,newpath:string):Promise<void>=>{

  return new Promise((resolve,reject)=>{

    fs.rename(oldpath,newpath,(err)=>{
      if(err) reject(err);
      else  resolve();
    })
  })

}