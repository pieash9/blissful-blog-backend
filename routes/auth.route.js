import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", AuthController.signup);

router.post("/signin", AuthController.signin);

export const AuthRoutes = router;
