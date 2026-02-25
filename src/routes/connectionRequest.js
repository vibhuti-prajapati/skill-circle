import express from "express";
import { userAuth } from "../middlewares/auth.js";
import {
  sendRequest,
  reviewRequest,
} from "../controllers/connectionRequest.controller.js";
import {
  sendRequestValidator,
  reviewRewuestValidator,
} from "../utils/validation.js";

const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send",
  userAuth,
  sendRequestValidator,
  sendRequest,
);

connectionRouter.patch(
  "/request/review/",
  userAuth,
  reviewRewuestValidator,
  reviewRequest,
);
export { connectionRouter };
