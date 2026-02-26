import { cloudinary } from "../config/cloudinary.js";
import AppError from "../utils/AppError.js";

export const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }
};

export const replaceImage = async (oldPublicId, newFile) => {
  try {
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    return {
      url: newFile.path,
      publicId: newFile.filename,
    };
  } catch (err) {
    throw new AppError("cloudinary image replacement failed  :" + err.message, 500);
  }
};
