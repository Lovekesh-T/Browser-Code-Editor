import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncError } from "../utils/AsyncError";
import { copyS3Folder } from "../utils/aws";

export const createProject = asyncError(async (req: any, res, next) => {
  const { lang, replID }: { lang: string; replID: string } = req.body;

  if (!lang || !replID) throw new ApiError("Lang and repelID is required", 400);
  await copyS3Folder(`base/${lang}`, `code/${req.user.username}/${replID}`);

  res.status(200).json(new ApiResponse("Sucessfully Copied base code", 200));
});
