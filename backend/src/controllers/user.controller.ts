import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncError } from "../utils/AsyncError";

export const createUser = asyncError(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    throw new ApiError("All inputs are required", 400);

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) {
    if (userExist.username === username) {
      throw new ApiError("Username is already taken", 400);
    } else throw new ApiError("Email is already taken", 400);
  }

  await User.create({ username, email, password });

  res.status(200).json(new ApiResponse("Sign Up successfull", 200));
});


//login user
export const login = asyncError(async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password)
    throw new ApiError("All inputs are required", 400);

  const user = await User.findOne({
    $or: [{ username:identifier }, { email:identifier }],
  });

  if (!user) throw new ApiError("User not found", 404);

  if (!user.isPasswordValid(password))
    throw new ApiError("Username or password is incorrect", 400);

  const token = user.generateJWT();

  res
    .cookie("token",token,{
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24) ,
        path:"/",
        httpOnly:true,
        
    })
    .status(200)
    .json(new ApiResponse("User logged in successfully", 200, token));
});


export const getMe = asyncError(async (req:any,res,next)=>{
     const user = req.user;

     res.status(200).json(new ApiResponse("User fetched successfully",200,user))
})
