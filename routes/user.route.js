import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, UserController.updateUser);
router.delete("/delete/:userId", verifyToken, UserController.deleteUser);
router.post("/signout", UserController.signout);
router.get("/getusers", verifyToken, UserController.getUsers);
router.get("/:userId", UserController.getUser);

export const UserRoutes = router;
