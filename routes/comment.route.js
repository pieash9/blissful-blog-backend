import express from "express";
import { CommentController } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, CommentController.createComment);

export const CommentRoutes = router;
