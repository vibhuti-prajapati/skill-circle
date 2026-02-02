import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { editDataValidator } from "../utils/validation.js";
import User from "../models/user.js";
import upload from "../middlewares/upload.js";
import user from "../models/user.js";
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
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
profileRouter.post(
  "/profile/uploadImage",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const imageUrl = req.file.path;
      await user.findByIdAndUpdate(req.user._id, {
        $set: { profileImage: imageUrl },
      });
      res.json({message:"image uploaded !", imageUrl : imageUrl})
    } catch (err) {
      console.log(err);
      res.send("something went wrong" + err);
    }
  },
);
// TODO : only do image upload if user is actually saving the changes 
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!(await editDataValidator(req))) {
      throw new Error("data is not valid");
    }

    Object.keys(req.body).every((field) => {
      req.user[field] = req.body[field];
    });
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body);
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
