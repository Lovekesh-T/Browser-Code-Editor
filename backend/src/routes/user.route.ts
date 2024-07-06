import express from "express";
import { createUser, getMe, login } from "../controllers/user.controller";
import { isAuthenticated } from "../middlwares/authentication";


const router = express.Router()

router.get("/me",isAuthenticated,getMe);
router.post("/create",createUser)
router.post("/login",login)

export default router
