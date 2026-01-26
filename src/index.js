import express from "express";
import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";
const app = express();
dotenv.config();
app.get("/userdata", (req, res) => {
  throw new Error("hfwienong");
});
app.use("/", (err, req, res, next) => {
  if (err) {
    console.error(err);
    res.send("something went wrong..");
  }
});
app.use(express.json());
app.post("/signUp", (req, res) => {
  try {
    console.log(req.body);
    const {name, email, password} = req.body;
    const user = new User({name, email, password});
    user.save();
    res.send("saved successfully!");
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.send("something went wrong...");
  }
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
