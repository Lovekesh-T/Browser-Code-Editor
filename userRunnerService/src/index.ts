import express from "express";
import cors from "cors"
import http from "http";
import { initWs } from "./ws";
import dotenv from "dotenv";
dotenv.config()


const app =  express()

app.use(cors());


const server  = http.createServer(app);

initWs(server)


server.listen(4000,()=>{
    console.log("userRunner service is running on port 4000")
})

