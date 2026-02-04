import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
dotenv.config();

const userAuth= async (req, res,next)=>{
try{  const {token} =req.cookies;
  if(!token){
    return res.status(401).json({success : false ,message :"please log in"});
  }
  const {_id} =jwt.verify(token, process.env.JWT_SECRET_KEY); 

  const user =await User.findOne({_id: _id});
  if(!user){
    res.status(401).json({success :false, message :"you are not authorized for this action "});
  }else{
    req.user=user;
    next();
  }}catch(err){
    console.log(err);
    res.status(400).send("ERROR" +err);
  }
}; 

export {userAuth};