import express from "express";
import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import validate from "validator";
import cookieParser from "cookie-parser";
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
    const passwordHash= await bcrypt.hash(password,10);
    const user = new User({ name, email, password : passwordHash });
    await user.save();
    res.send("saved successfully!");
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.send("something went wrong...");
  }
});

app.post("/login", async (req,res)=>{
  try{
    const {email, password}= req.body;
    if(!validate.isEmail){
      throw new error("email format is correct");
    }
    const user = await User.findOne({email:email});
    if(!user){
      throw new Error("invalid credentials");
    }
    const isPasswordValid =await bcrypt.compare(password, user.password);
    if(isPasswordValid){
      const token  = "fndofhoanogaieregneogj932safg4wrtg";
      res.cookie("token", token);
      res.send("login sucessfull");
    }else{
      throw new Error("invalid credentials");
    }
  }catch (err) {
    console.error(err);
    res.status(400).send("something went wrong..." +err);
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const { userEmail } = req.body.email;
    const user = await User.find(userEmail);
    if (!user) {
      res.status(404).send("user not found!");
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
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    console.log(err);
    res.send("something went wrong ");
  }
});

//find one
app.get("/findOne", async (req, res) => {
  try {
    const { userEmail } = req.body.email;
    const cookies= req.cookies;
    const {token}= cookies;
    if(!token){
      throw new Error("not logged in ");
    }
    console.log(token);
    const user = await User.findOne(userEmail);
    if (!user) {
      res.send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log(err);
    res.send("something went wrong" +err);
  }
});

// delete user by id
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send("user doesnt exist");
    } else {
      const deletedUser = await User.findByIdAndDelete(user._id); 
      if(!deletedUser){
        res.status(404).send("operation failed");
      }else{
        res.send("deleetd document : "+ deletedUser)
      }
    }
  } catch (err) {
    console.log(err);
    res.send("something went wrong");
  }
});


// fiind by id 
app.get("/user", async (req, res)=>{
  try{
    const user = await User.findById(req.body.userId);
    if(!user){
      res.status(404).send("not found !");
    }else{
      res.send(user);
    }
  }catch(err){
    console.log(err);
    res.send("something went wrong ");
  }
}) ; 

// update a user document  by email
app.patch("/user", async (req, res)=>{
  try{
    if(req?.body.skills.length>10){
     throw new Error("too many skills , limit is 10");
    }
    const user = await User.findOne({email: req.body.email});
    if(!user){
      res.status(404).send("user doesnt exist");
    } else {
      const updatedUser = await User.findByIdAndUpdate(user._id, req.body,{ runValidators : true}); 
      if(!updatedUser){
        res.status(404).send("operation failed");
      }else{
        res.send("updated document : "+ updatedUser);
      }
    }
  }catch(err){
    console.log(err);
    res.status(400).send("something went wrong " + err);
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
