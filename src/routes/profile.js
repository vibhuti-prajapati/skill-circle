import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { editDataValidator } from "../utils/validation.js";
import { view, editProfile } from "../controllers/profile.controller.js";
import upload from "../middlewares/upload.js";
const profileRouter = express.Router();
import AsyncHandler from "../middlewares/asyncHandler.js";

profileRouter.get("/profile/view", userAuth, AsyncHandler(view));
// // TODO : BANNER IMAGE UPLOAD
// TODO : image file resizing
// TODO : REStrict file size
// TODO : proper error handling

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  editDataValidator,
  AsyncHandler(editProfile),
);

export { profileRouter };
