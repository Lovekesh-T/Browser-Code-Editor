import express from "express";
import { createProject } from "../controllers/project.controller";
import { isAuthenticated } from "../middlwares/authentication";



const router = express.Router()


router.post("/create",isAuthenticated,createProject)


export default router
