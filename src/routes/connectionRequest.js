import express from "express";
import { userAuth } from "../middlewares/auth.js";
import User from "../models/user.js";
import ConnectionRequest from "../models/connectionRequest.js";
import mongoose from "mongoose";
const connectionRouter = express.Router();

connectionRouter.post("/request/send", userAuth, async (req, res) => {
  // TODO :  should have a different middleware or controller for this maybe
  try {
    const fromUserId = req.user._id;
    const { toUserId } = req.body;

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
    // TODO : improve this for race conditions

    // allowed duplicate requests if the status is not pending or accepted
    // ---> so after request is cancelled it can be made again

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
      status: { $in: ["pending", "accepted"] },
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

connectionRouter.patch("/request/review/", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { requestId } = req.body;
    const { status } = req.body;

    // should i snaitize the json req body because user can send unneccesary fields
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
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ succeess: false, message: "status is not valid" });
    }
    // checkn request if valid mongoose id
    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return res
        .status(400)
        .json({ succeess: false, message: "requestID is not valid" });
    }
    // check if request exists
    const existingRequest = await ConnectionRequest.findOne({
      _id: requestId,
      status: "pending",
    });
    if (!existingRequest || existingRequest.status !== "pending") {
      return res
        .status(400)
        .json({ succeess: false, message: "request not found" });
    }

    // now some authorization check
    // toUser == loggedIn user => accept
    // toUser == loggedIn user => cancel
    // fromUser == loggedIn user => cancel

    const isSender = existingRequest.fromUserId.equals(loggedInUser._id);
    const isReceiver = existingRequest.toUserId.equals(loggedInUser._id);
    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (status === "accepted" && !isReceiver) {
      return res
        .status(403)
        .json({ success: false, message: "not authorized" });
    }

    existingRequest.status = status;
    const data = await existingRequest.save();
    return res.status(200).json({
      success: true,
      message: "request status changed to " + status,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status.send("something went wrong");
  }
});
export { connectionRouter };
