import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, UserController.updateUser);

export const UserRoutes = router;
