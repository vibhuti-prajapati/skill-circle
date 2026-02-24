import { cloudinary } from "../config/cloudinary.js";

export const deleteImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

export const replaceImage = async (oldPublicId, newFile) => {
  if (oldPublicId) {
    await deleteImage(oldPublicId);
  }
  return {
    url: newFile.path,
    publicId: newFile.filename,
  };
};
