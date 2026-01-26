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
app.get("/findOne", async (req, res) => {
  try {
    const { userEmail } = req.body.email;
    const user = await User.findOne(userEmail);
    if (!user) {
      res.send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.send("something went wrong");
  }
});

// delete user by id
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.statusCode(404).send("user doesnt exist");
    } else {
      const deletedUser = await User.findByIdAndDelete(user._id); 
      if(!deletedUser){
        res.statusCode(404).send("operation failed");
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
      res.statusCode(404).send("not found !");
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
    const user = await User.findOne({email: req.body.email});
    if(!user){
      res.statusCode(404).send("user doesnt exist");
    } else {
      const updatedUser = await User.findByIdAndUpdate(user._id, req.body); 
      if(!updatedUser){
        res.statusCode(404).send("operation failed");
      }else{
        res.send("updated document : "+ updatedUser);
      }
    }
  }catch(err){
    console.log(err);
    res.send("something went wrong ");
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
