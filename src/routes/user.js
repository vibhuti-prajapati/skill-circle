import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import * as controller from '../controllers/user.controller.js';

const userRouter = express.Router();
userRouter.get("/user/request/received", userAuth, controller.receivedRequest);

userRouter.get("/user/request/sent", userAuth, controller.sentRequest);

userRouter.get("/user/request/connections", userAuth, controller.connections);

userRouter.get("/user/feed", userAuth, controller.loadFeed);
export { userRouter };
