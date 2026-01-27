import express from "express";
import { userAuth } from "../middlewares/auth.js";

const profileRouter= express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.send("something went wrong" + err);
  }
}); 

export  {profileRouter};