import express from "express";
import { CommentController } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, CommentController.createComment);
router.get("/getPostComments/:postId", CommentController.getPostComment);
router.put(
  "/likeComment/:commentId",
  verifyToken,
  CommentController.likeComment
);
router.put(
  "/editComment/:commentId",
  verifyToken,
  CommentController.editComment
);
router.delete(
  "/deleteComment/:commentId",
  verifyToken,
  CommentController.deleteComment
);

export const CommentRoutes = router;
