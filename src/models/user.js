import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage:{
      type:String
    },
    age: {
      type: Number,
      required: false,
      min: 5,
    },
    gender: {
      type: String,
      enum:{
        values:["male", "female", "other"],
        message:`{VALUE} is not a valid input`
      },
      // validate(value) {
      //   if (!["male", "female", "other"] === value) {
      //     throw new Error("gender value is not valid");
      //   }
      // },
    },
    about: {
      type: String,
      default: "this is the default value.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);
// these methods return a promise since they are async so remember to use await when you  use them or you will be dealing with promises without even knowing 

userSchema.methods.createJWT = async function () {
  return jwt.sign({ _id: this._id }, "supersecretkeyofvibhuti", {
    expiresIn: "7d",
  });
};
userSchema.methods.validatePassword = async function (passwordInput) {
  const passwordHash = this.password;
  return await bcrypt.compare(passwordInput, passwordHash);
};
export default new mongoose.model("User", userSchema);
