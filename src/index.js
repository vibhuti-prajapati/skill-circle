import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import {connectionRouter} from "./routes/connectionRequest.js";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/",connectionRouter)
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
