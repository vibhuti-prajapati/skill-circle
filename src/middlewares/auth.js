import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
dotenv.config();

const userAuth= async (req, res,next)=>{
try{  const {token} =req.cookies;
  if(!token){
    throw new Error("token not present");
  }
  const {_id} =  jwt.verify(token, "supersecretkeyofvibhuti"); 

  const user =await User.findOne({_id: _id});
  if(!user){
    res.status(400).send("you are not authorized for this action ");
  }else{
    req.user=user;
    next();
  }}catch(err){
    console.log(err);
    res.status(400).send("ERROR" +err);
  }
}; 

export {userAuth};