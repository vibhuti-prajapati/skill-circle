import { deleteImage } from "../services/cloudinary.service.js";
import mongoose from "mongoose";
const editDataValidator = async (req, res, next) => {
  const allowedFields = [
    "name",
    "age",
    "skills",
    "about",
    "gender",
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

    return res.status(400).json({
      success: false,
      message: "Invalid data",
    });
  }
  req.body.removeBannerImage = req.body.removeBannerImage === "true";
  req.body.removeProfileImage = req.body.removeProfileImage === "true";
  next();
};

const sendRequestValidator = async (req, res, next) => {
  if (!req.body.toUserId || !mongoose.Types.ObjectId.isValid(req.body.toUserId)) {
    return res
      .status(400)
      .json({ success: false, message: "user id invalid!" });
  }
  if (req.user._id.equals(req.body.toUserId)) {
    return res
      .status(400)
      .json({ success: false, message: "cannot send connection to yourself" });
  }
  next();
};

const reviewRewuestValidator = async (req, res, next) => {
  const allowedFields = ["requestId", "status"];
  const isDataValid = Object.keys(req.body).every((field) => {
    return allowedFields.includes(field);
  });
  if (!isDataValid) {
    return res
      .status(400)
      .json({ succeess: false, message: "data is not valid" });
  }
  // check the status
  const allowedStatus = ["accepted", "cancelled"];
  if (!allowedStatus.includes(req.body.status)) {
    return res
      .status(400)
      .json({ succeess: false, message: "status is not valid" });
  }
  // checkn request if valid mongoose id
  if (
    !req.body.requestId ||
    !mongoose.Types.ObjectId.isValid(req.body.requestId)
  ) {
    return res
      .status(400)
      .json({ succeess: false, message: "requestID is not valid" });
  }
  next();
};

export { editDataValidator, sendRequestValidator, reviewRewuestValidator };
 