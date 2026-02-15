import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import validate from "validator";
import isEmail from "validator/lib/isEmail.js";

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    // TODO : validate email and password and name stuff
    const { name, email, password } = req.body;
    if (!isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "email formart is not valid!" });
    }
    const checkEmailExist = await User.find({ email });
    if (checkEmailExist.length>0) {
      console.log(checkEmailExist)
      return res
        .status(400)
        .json({ success: false, message: "email is already registered!" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: passwordHash });
    await user.save();
    res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(400).send("something went wrong...");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO : make the method call properly (avaoiding because existing mail format in dbis bad)
    if (!validate.isEmail) {
      return res.json({ message: "email format is correct" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ message: "invalid credentials" });
    }
    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.createJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      console.log(user.email);
      res.json({ message: "login sucessfull", data: user });
    } else {
      return res.json({ message: "invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send();
});
export { authRouter };
