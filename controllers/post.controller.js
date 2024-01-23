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

const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const post = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPost = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gt: oneMonthAgo },
    });

    res.status(200).json({ totalPost, lastMonthPost, post });
  } catch (error) {
    next(error);
  }
};

export const PostControllers = { create, getPosts };