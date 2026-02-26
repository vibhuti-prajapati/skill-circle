import express from "express";
import { userAuth } from "../middlewares/auth.js";
import * as controller from "../controllers/user.controller.js";
import AsyncHandler from "../middlewares/asyncHandler.js";

const userRouter = express.Router();
userRouter.get(
  "/user/request/received",
  userAuth,
  AsyncHandler(controller.receivedRequest),
);

userRouter.get(
  "/user/request/sent",
  userAuth,
  AsyncHandler(controller.sentRequest),
);

userRouter.get(
  "/user/request/connections",
  userAuth,
  AsyncHandler(controller.connections),
);

userRouter.get("/user/feed", userAuth, AsyncHandler(controller.loadFeed));

export { userRouter };
