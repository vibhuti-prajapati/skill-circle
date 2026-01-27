import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { editDataValidator } from "../utils/validation.js";
import User from "../models/user.js";

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.send("something went wrong" + err);
  }
});

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

    res.json({ message: "update was successfull", data:updatedUser });
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR: " + err);
  }
});

export { profileRouter };
