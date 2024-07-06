import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncError } from "../utils/AsyncError";

export const isAuthenticated = asyncError(async (req: any, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies.token;

  if (!token) throw new ApiError("Token is required", 401);
  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new ApiError("Invalid token", 401);
  }

  req.user = user;
  next()
});
