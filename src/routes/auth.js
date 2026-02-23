import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/signUp", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);
export { authRouter };
