import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import user from "../models/user.js";

const userRouter = express.Router();
const ALLOWED_FEILDS = ["name", "age", "gender", "about", "skills"];

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "pending",
    }).populate("fromUserId", ALLOWED_FEILDS);

    res.json({
      success: true,
      data: pendingRequests,
      count: pendingRequests.length,
    });
  } catch (err) {
    console.log(err);
    res.send("ERROR :" + err);
  }
});

userRouter.get("/user/request/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const acceptedRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", ALLOWED_FEILDS)
      .populate("toUserId", ALLOWED_FEILDS);

    const connenctions = acceptedRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.send(connenctions);
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong");
  }
});

// TODO : enhance the feed api -> add filters and more stuff 
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) > 20 ? 10 : req.query.limit || 10 ;
    const skip = (page - 1) * limit;

    // get ._id of people who have sent or received requests from :status ="pending"|| "accepted"
    const sentRequestProfiles = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: { $in: ["pending", "accepted"] },
    }).select("fromUserId toUserId");

    const hiddenProfiles = new Set();
    sentRequestProfiles.forEach((element) => {
      hiddenProfiles.add(element.fromUserId.toString());
      hiddenProfiles.add(element.toUserId.toString());
    });
    const users = await user
      .find({
        _id: { $nin: Array.from(hiddenProfiles) },
        _id: { $ne: loggedInUser._id },
      })
      .select(ALLOWED_FEILDS)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (err) {
    console.log(err);
    res.send("something went wrong");
  }
});
export { userRouter };
