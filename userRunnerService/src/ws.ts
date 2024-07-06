import { Server, Socket } from "socket.io";
import {Server as HttpServer} from "http";
import { saveToS3 } from "./aws";
import { createFile, deleteFile, deleteFolderRecursive, fetchDir, fetchFileContent, renameFile, saveFile } from "./fs";
import path from "path"
import chokidar from "chokidar"
import { TransferCmdService } from "./transferCmd";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config()



const cmdService = new TransferCmdService();
const watcher = chokidar.watch(process.env.WORKPLACE!,{
    persistent:true
})


export function initWs(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            // Should restrict this more!
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
      
    io.on("connection", async (socket) => {
        console.log("new connection")
        // Auth checks should happen here
        const host = socket.handshake.headers.host;
        console.log(`host is ${host}`);
        // Split the host by '.' and take the first part as replId
        const username_replID = host?.split('.')[0];

        const username = username_replID?.split("-")[0];
        const replId = username_replID?.split("-").slice(1).join("-");
    
        if (!replId || !username) {
            console.log("hello ")
            socket.disconnect();
            // terminalManager.clear(socket.id);
            cmdService.disconnect();
            return;
        }

   
        watcher.on("all",(event,path)=>{
            path = path.replace(process.env.WORKPLACE!,"")
            socket.emit("directory-changed",{event,path});
        })
         

        initHandlers(socket, replId,username);
    });
}

function initHandlers(socket: Socket, replId: string,username:string) {
    

    socket.on("disconnect", () => {
        console.log("user disconnected");
        cmdService.disconnect();
    });

    socket.on("loadContent",async()=>{
        try {
            socket.emit("loaded", {
                rootContent: await fetchDir(process.env.WORKPLACE!, "")
            });
          } catch (error) {
           console.log(`loaded rootContent error: ${error}`)
           
          }
    })

    socket.on("createFile",async({type,path})=>{
        const fullPath = `${process.env.WORKPLACE!}${path}`
        console.log(fullPath);
        try {
            await createFile({type,path:fullPath});
            console.log("file created")
        } catch (error) {
            console.log(`create file error: ${error}`)
            
        }
    })
    
    socket.on("fetchDir", async ({dir}: {dir:string}, callback) => {
        const fullPath = process.env.WORKPLACE!
         const dirPath =   `${fullPath}${dir}`
       try {
         const contents = await fetchDir(dirPath, dir);
         callback(contents);
       } catch (error) {
          console.log(`fetchDir error: ${error}`)
       }
    });

    socket.on("fetchContent", async ({ path }: { path: string }, callback) => {
        const dpath = process.env.WORKPLACE!
         const fullPath = `${dpath}${path}`
        try {
            const data = await fetchFileContent(fullPath);
            callback(data);
        } catch (error) {
            console.log(`fetchContent error: ${error}`)
        }
    });

    // TODO: contents should be diff, not full file
    // Should be validated for size
    // Should be throttled before updating S3 (or use an S3 mount)
    socket.on("updateContent", async ({ path: filePath, content }: { path: string, content: string }) => {
        const fullPath =  `${process.env.WORKPLACE!}${filePath}`;
       try {
         await saveFile(fullPath, content);
         await saveToS3(`code/${username}/${replId}`, filePath, content);
       } catch (error) {
          console.log(`update content error: ${error}`)
       }
    });

    socket.on("deleteFile",async({path,type}:{path:string,type:"dir" | "file"})=>{
             try {
                switch (type){
                    case "dir":
                        deleteFolderRecursive(`/workspace${path}`);
                        break;
                    case "file":
                        await deleteFile(`/workspace${path}`)                   
                  }
             } catch (error) {
                console.log(`deleting error: ${error}`)
             }
    })

    socket.on("renameFile",async ({oldpath,newpath})=>{
        const completeOldPath = `/workspace${oldpath}`;
        const completeNewPath = `/workspace${newpath}`;
        console.log(completeNewPath,completeOldPath)
         try {
            console.log("renaming the file")
            await renameFile(completeOldPath,completeNewPath)     
         } catch (error) {
            console.log(`file renaming error: ${error}`)
         }
    })

    socket.on("requestTerminal", async () => {

        cmdService.connect((data:any)=>{
            socket.emit("terminal",{
                data
            })

        })
    });
    
    socket.on("terminalData", async ({ data }: { data: string, terminalId: number }) => {
        // terminalManager.write(socket.id, data);
        cmdService.sendTerminalData(data)
    });

}