import express from "express";
import { userAuth } from "../middlewares/auth.js";
import User from "../models/user.js";
import ConnectionRequest from "../models/connectionRequest.js";
import mongoose from "mongoose";
const connectionRouter = express.Router();

connectionRouter.post("/request/send", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const {toUserId} = req.body;

    if (!toUserId || !mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).send("user id invalid!");
    }
    if (fromUserId.equals(toUserId)) {
      return res
        .status(400)
        .json({ message: "cannot send connection to yourself" });
    }
    const isToUserIdValid = await User.findOne({ _id: toUserId });
    if (!isToUserIdValid) {
      return res.status(400).json({ message: "the user does not exist" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
    });

    await connectionRequest.save();

    return res.status(201).json({
      message: "connection request sent successfully",
      data: connectionRequest,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR : " + err);
  }
});

export { connectionRouter };
