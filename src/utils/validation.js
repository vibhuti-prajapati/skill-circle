import { deleteImage } from "../services/cloudinary.service.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

const editDataValidator = async (req, res, next) => {
  const allowedFields = [
    "name",
    "age",
    "skills",
    "about",
    "gender",
    "bannerImage",
    "profileImage",
    "removeProfileImage",
    "removeBannerImage",
  ];

  const isValid = Object.keys(req.body).every((field) =>
    allowedFields.includes(field),
  );
  const conflictProfile =
    req.body.removeProfileImage === "true" && req.files?.profileImage;

  const conflictBanner =
    req.body.removeBannerImage === "true" && req.files?.bannerImage;

  if (!isValid || conflictProfile || conflictBanner) {
    if (req.files?.profileImage) {
      await deleteImage(req.files.profileImage[0].filename);
    }

    if (req.files?.bannerImage) {
      await deleteImage(req.files.bannerImage[0].filename);
    }

    throw new AppError("conflicting instructions", 409);
  }
  req.body.removeBannerImage = req.body.removeBannerImage === "true";
  req.body.removeProfileImage = req.body.removeProfileImage === "true";
  next();
};

const sendRequestValidator = async (req, res, next) => {
  if (
    !req.body.toUserId ||
    !mongoose.Types.ObjectId.isValid(req.body.toUserId)
  ) {
    throw new AppError("invalid data ", 400)
  }
  if (req.user._id.equals(req.body.toUserId)) {
    throw new AppError("conflicting instrcutions", 409);
  }
  next();
};

const reviewRewuestValidator = async (req, res, next) => {
  const allowedFields = ["requestId", "status"];
  const isDataValid = Object.keys(req.body).every((field) => {
    return allowedFields.includes(field);
  });
  if (!isDataValid) {
    throw new AppError("invalid data ", 400);
  }
  // check the status
  const allowedStatus = ["accepted", "cancelled"];
  if (!allowedStatus.includes(req.body.status)) {
    throw new AppError("status is not valid ", 400);
  }
  // checkn request if valid mongoose id
  if (
    !req.body.requestId ||
    !mongoose.Types.ObjectId.isValid(req.body.requestId)
  ) {
    throw new AppError("request id is not valid ", 400);
  }
  next();
};

export { editDataValidator, sendRequestValidator, reviewRewuestValidator };
