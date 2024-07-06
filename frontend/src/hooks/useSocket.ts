import axios from "axios";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const useSocket = (replId: string) => {
  const [socket, setSocket] = useState<null | Socket>(null);
  useEffect(() => {
    const socket = io(`ws://${replId}.runner.com`);
    socket.on("connect",()=>{
      console.log("socket connected")
      setSocket(socket);

      socket.on("disconnect",async ()=>{
        console.log("disconnecting socket")
        // try {
        //  const {data} =  await axios.post("http://localhost:3002/delete",{username:replId.split("-")[0],replId:replId.split("-").slice(1).join("-")})
        //   console.log(data.message)
        // } catch (error) {
        //    console.log(error)
        // }
      })
    })

    return () => {socket.disconnect()}
  }, [replId]);

  return socket;
};
