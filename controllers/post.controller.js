import { Post } from "../model/post.model.js";
import { errorHandler } from "../utils/error.js";

const create = async (req, res, next) => {
  const { title, content } = req.body;
  const { id, isAdmin } = req.user;
  if (!isAdmin) {
    return next(errorHandler(403, "You are not allowed to post."));
  }
  if (!title || !content) {
    return next(errorHandler(400, "Provide all required fields."));
  }
  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({ ...req.body, slug, userId: id });

  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (error) {
    next(error);
  }
};

export const PostControllers = { create };
