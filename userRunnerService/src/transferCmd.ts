import {WebSocket} from "ws"


export class TransferCmdService{
   private ws:WebSocket | null;
      constructor(){
        this.ws = null;
    }

    connect(callback:(data:any)=>void){
      this.ws = new WebSocket(`ws://${process.env.HOST}:${process.env.PORT}`);  
      
      this.ws.on("open",()=>{
        console.log("connected to cmd service");
        this.ws?.send(JSON.stringify({type:"requestTerminal"}))    
      })

      this.ws.on("message",(message:string)=>{
        const {type,data} = JSON.parse(message);

        if(type === "terminalData"){
            callback(data)
        }
      })
    }
    sendTerminalData(data:any){
         this.ws?.send(JSON.stringify({type:"terminal",data}))
    }

    disconnect(){
        this.ws?.close()
    }
}