import express from "express";
import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import validate from "validator";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { userAuth } from "./middlewares/auth.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.get("/userdata", (req, res) => {
  throw new Error("hfwienong");
});

app.post("/signUp", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validate.isEmail) {
      throw new error("email format is correct");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign(
        { _id: user._id },
        "supersecretkeyofvibhuti",
        {expiresIn:"0d"}
      );
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

//find one
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.send("something went wrong" + err);
  }
}); 

app.post("/sentConnectionRequest", userAuth, async (req, res)=>{

});

await mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db connected!");
    app.listen(3001, () => {
      console.log("server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
