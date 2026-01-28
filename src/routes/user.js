import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const ALLOWED_FEILDS = ["name", "age", "gender", "about", "skills"];

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
    const ALLOWED_FEILDS = ["name", "age", "gender", "about", "skills"];

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

export { userRouter };
