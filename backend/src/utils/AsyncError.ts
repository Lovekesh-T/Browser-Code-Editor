import { NextFunction, Request, Response } from "express";

export const asyncError = (routeHandler:(req:Request,res:Response,next:NextFunction)=>Promise<void>)=>{

  return (req:Request,res:Response,next:NextFunction)=>{
        routeHandler(req,res,next).catch(next);
  }

}