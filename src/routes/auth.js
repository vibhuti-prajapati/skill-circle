import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const authRouter = express.Router();

authRouter.post("/signUp", asyncHandler(signup));

authRouter.post("/login", asyncHandler(login));

authRouter.post("/logout", asyncHandler(logout));
export { authRouter };
