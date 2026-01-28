import express from "express";
import  {userAuth}  from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";

const userRouter= express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "pending",
    }).populate("fromUserId", ["name", "age", "gender", "about", "skills"]);
    
    res.json({
      success: true,
      data: pendingRequests,
      count: pendingRequests.length
    });
  } catch (err) {
    console.log(err);
    res.send("ERROR :" + err);
  }
});

export {userRouter};