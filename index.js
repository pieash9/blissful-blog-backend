/* eslint-disable no-unused-vars */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { AuthRoutes } from "./routes/auth.route.js";
import { UserRoutes } from "./routes/user.route.js";
import { PostRoutes } from "./routes/post.route.js";
import { CommentRoutes } from "./routes/comment.route.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://blissfull-blog.netlify.app",
      "http://localhost:5000",
      "https://blissful-blog.vercel.app",
    ],
    credentials: true, // Include if you're using credentials (e.g., cookies, authentication)
  })
);

app.use(cookieParser());
const port = 5000;

const server = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    app.listen(port, () => {
      console.log("DB connected & server is running at port", port);
    });
  } catch (error) {
    console.log("DB failed to connect =>", error);
  }
};

server();

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/post", PostRoutes);
app.use("/api/v1/comment", CommentRoutes);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error.";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
