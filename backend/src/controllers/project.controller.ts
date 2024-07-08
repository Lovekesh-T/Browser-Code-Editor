import { Repl } from "../models/repl.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncError } from "../utils/AsyncError";
import { copyS3Folder } from "../utils/aws";

export const createProject = asyncError(async (req: any, res, next) => {
  const { lang, replID }: { lang: string; replID: string } = req.body;

  if (!lang || !replID) throw new ApiError("Lang and repelID is required", 400);
  await Repl.create({
    replId: `${req.user.username}-${replID}`,
    user: req.user.id,
    language: lang,
  });

  await copyS3Folder(`base/${lang}`, `code/${req.user.username}/${replID}`);

  res.status(200).json(new ApiResponse("Sucessfully Copied base code", 200));
});


export const deleteRepl = asyncError(async (req,res,next)=>{
   const {id} = req.params;

   if(!id) throw new ApiError("Repl id is missing",400);

   await Repl.findByIdAndDelete(id);

   res.status(200).json(new ApiResponse("Successfully deleted Repl",200));

})


export const getAllRepl = asyncError(async (req:any,res,next)=>{
   const repls = await Repl.find({user:req.user.id})

   res.status(200).json(new ApiResponse("Successfully fetched all repls",200,repls));
})


