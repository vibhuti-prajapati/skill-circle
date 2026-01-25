import express from "express";
import {adminAuth, userAuth} from "./middlewares/auth.js"
const app = express();

// request handler
app.get("/admin/getData" , adminAuth, (req, res)=>{
  res.send("all data for admin");
});
app.get("/user", userAuth,(req,res)=>{
  res.send("user data");
});
app.listen(3001, () => {
  console.log("server running on port 3001");
});

