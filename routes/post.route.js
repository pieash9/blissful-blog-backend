import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { PostControllers } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, PostControllers.create);

export const PostRoutes = router;
