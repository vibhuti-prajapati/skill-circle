import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { editDataValidator } from "../utils/validation.js";
import User from "../models/user.js";
import upload from "../middlewares/upload.js";
const profileRouter = express.Router();
const allowedFields = ["name", "email", "about", "skills", "gender", "bannerImage", "profileImage"];

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.json({ data: req.user });
  } catch (err) {
    console.log(err);
    res.send("something went wrong" + err);
  }
});

// TODO :  REMOVE OLD IMAGE if exists on clooudinary before uploading new one
// TODO : delete image from cloudinary when user removes the profile picture
// TODO : banner image upload
// TODO : image file resizing
//TODO : REStrict file size
// TODO : proper error handling
profileRouter.patch(
  "/profile/uploadImage",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const imageUrl = req.file.path;
      const type = req.body.type;

      if (!["profileImage", "bannerImage"].includes(type)) {
        return res.status(400).json({ message: "Invalid type" });
      }

      res.json({
        message: `${type} uploaded successfully`,
        imageUrl,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  },
);
// TODO : only do image upload if user is actually saving the changes
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!(await editDataValidator(req))) {
      throw new Error("data is not valid");
    }

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true },
    );
    if (!updatedUser) {
      throw new Error("operation failed");
    }

    res.json({ message: "update was successfull", data: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR: " + err);
  }
});

export { profileRouter };
