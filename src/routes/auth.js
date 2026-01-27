import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import validate from "validator";

const authRouter= express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: passwordHash });
    await user.save();
    res.send("saved successfully!");
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.send("something went wrong...");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validate.isEmail) {
      throw new error("email format is correct");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.createJWT();
      res.cookie("token", token,  {
    expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
  });
      res.send("login sucessfull");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("something went wrong..." + err);
  }
});

authRouter.post("/logout", async (req,res)=>{
    res.cookie("token", null, {expires : new Date(Date.now())});
    res.send();
});
export {authRouter};