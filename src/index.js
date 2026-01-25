import express from "express";
import {adminAuth, userAuth} from "./middlewares/auth.js"
const app = express();

app.get("/userdata", (req,res)=>{
  throw new Error("hfwienong");
});
app.use("/",(err, req,res,next)=>{
  if(err){
    console.error(err);
    res.send("something went wrong..");
  }
});
app.listen(3001, () => {
  console.log("server running on port 3001");
});

