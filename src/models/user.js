import mongoose from "mongoose";

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
      trim : true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
      min: 5,
    },
    gender: {
      type: String,
      lowercase: true,
      trim :true,
      validate(value) {
        if (!["male", "female", "other"] === value) {
          throw new Error("gender value is not valid");
        }
      },
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
export default new mongoose.model("User", userSchema);
