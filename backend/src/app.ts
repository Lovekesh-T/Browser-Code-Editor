import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import projectRouter from "./routes/project.route";
import cookieParser from "cookie-parser"
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}));




app.use("/api/v1/user",userRouter)
app.use("/api/v1/project",projectRouter)

app.use((error:any,req:Request,res:Response,next:NextFunction)=>{

    const message = error.message || "Internal Server Error";
    const statusCode = error.statusCode || 500;
    const success = error.success || false;

    res.status(statusCode).json({message,statusCode,success});

})
export {app}

