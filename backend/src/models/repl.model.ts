import mongoose, { Document } from "mongoose";

interface IRepl extends Document{
    user:string;
    replId:string;
    language:"nodejs" | "java" | "python"

}

const replSchema  = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true       
    },
    replId:{
        type:String,
        required:true,
        unique:true
    },
    language:{
        type:String,
        enum:["nodejs","java","python"],
        required:true
    }

},{timestamps:true});



export const Repl = mongoose.model<IRepl>("repl",replSchema);