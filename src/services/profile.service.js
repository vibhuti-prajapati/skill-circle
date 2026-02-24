import User from "../models/user.js";
import { replaceImage, deleteImage } from "./cloudinary.service.js";
export const editProfile = async ({ userId, updates, files }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    // updating the fields
    Object.assign(user, updates);

    /****
     * req.files = {
     * profileImage: [ { ...fileData } ],
     * bannerImage: [ { ...fileData },
     * }
     *****/
    if (updates.removeBannerImage) {
      await deleteImage(user.bannerImagePublicId);
      user.bannerImage = null;
      user.bannerImagePublicId = null;
    }
    if (updates.removeProfileImage) {
      await deleteImage(user.profileImagePublicId);
      user.profileImage = null;
      user.profileImagePublicId = null;
    }
    // image cleanup and updattion
    if (files?.profileImage) {
      const imageData = await replaceImage(
        user.profileImagePublicId,
        files.profileImage[0],
      );

      user.profileImage = imageData.url;
      user.profileImagePublicId = imageData.publicId;
    }

    if (files?.bannerImage) {
      const imageData = await replaceImage(
        user.bannerImagePublicId,
        files.bannerImage[0],
      );

      user.bannerImage = imageData.url;
      user.bannerImagePublicId = imageData.publicId;
    }

    await user.save();
    return {
      success: true,
      message: "profile updated successfully",
      data: user,
    };
};
