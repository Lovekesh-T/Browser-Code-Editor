import express from "express";
import { createProject, deleteRepl } from "../controllers/project.controller";
import { isAuthenticated } from "../middlwares/authentication";



const router = express.Router()


router.post("/create",isAuthenticated,createProject)
router.delete("/delete/:id",isAuthenticated,deleteRepl);
router.get("/all",isAuthenticated)


export default router
