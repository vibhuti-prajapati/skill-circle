import { deleteImage } from "../services/cloudinary.service.js";

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
    allowedFields.includes(field)
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

export { editDataValidator };
