import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import {connectionRouter} from "./routes/connectionRequest.js";
import { userRouter } from "./routes/user.js";
import cors from "cors";
const app = express();
dotenv.config();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))
app.use(express.json());
app.use(cookieParser());

// TODO : fix the routes and keep code in separate files for router and controller
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/",connectionRouter)
app.use("/", userRouter);
await mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db connected!");
    app.listen(3001, () => {
      console.log("server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
