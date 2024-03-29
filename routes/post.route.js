import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { PostControllers } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, PostControllers.create);

router.get("/getPosts", PostControllers.getPosts);

router.delete(
  "/deletePost/:postId/:userId",
  verifyToken,
  PostControllers.deletePost
);

router.put(
  "/updatePost/:postId/:userId",
  verifyToken,
  PostControllers.updatePost
);

export const PostRoutes = router;
