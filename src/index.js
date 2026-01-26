import express from "express";
import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";
const app = express();
dotenv.config();

app.use(express.json());

app.get("/userdata", (req, res) => {
  throw new Error("hfwienong");
});

app.post("/signUp", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.send("saved successfully!");
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.send("something went wrong...");
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const { userEmail } = req.body.email;
    const user = await User.find(userEmail);
    if (!user) {
      res.statusCode(404).send("user not found!");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log(err);
    res.send("something went wrong");
  }
});

// get all users
app.get("/getFeed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.statusCode(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    console.log(err);
    res.send("something went wrong ");
  }
}); 

//find one 
app.get("/findOne" , async (req, res)=>{
  try{
    const {userEmail}= req.body.email;
    const user = await User.findOne(userEmail);
    if(!user){
      res.send("user not found");
    }else{
      res.send(user);
    }
  }catch(err){
    res.send("something went wrong");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    console.error(err);
    res.send("something went wrong..");
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
