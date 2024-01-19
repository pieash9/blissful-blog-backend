import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { AuthRoutes } from "./routes/auth.route.js";

const app = express();
app.use(express.json());
app.use(cors());
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

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error.";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
