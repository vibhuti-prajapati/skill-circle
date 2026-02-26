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
import AsyncHandler from "../middlewares/asyncHandler.js";
const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send",
  userAuth,
  sendRequestValidator,
  AsyncHandler(sendRequest),
);

connectionRouter.patch(
  "/request/review/",
  userAuth,
  reviewRewuestValidator,
  AsyncHandler(reviewRequest),
);
export { connectionRouter };
