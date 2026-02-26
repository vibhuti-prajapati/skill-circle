import { hashPassword } from "../utils/hash.js";
import User from '../models/user.js'
import { validateEmail } from "../utils/validateEmail.js";
import { createJWT } from "../utils/token.js";
import AppError from "../utils/AppError.js";

export const signUp = async ({ name, email, password }) => {
  if (!validateEmail(email)) {
    throw new AppError("email format is not valid!",400);
  }
  const checkEmailExist = await User.find({ email });
  if (checkEmailExist.length > 0) {
    throw new AppError("email already exists", 409);
  }
  const hashedPassword = await hashPassword(password);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  return { message: "User created successfully" };
};

export const login = async ({ email, password }) => {
  if (!validateEmail(email)) {
    throw new AppError("email format is not valid!",400);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError("invalid credentials",403);
  }
  const isPasswordValid = user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError("invalid credentials",400);
  }
  const token = await createJWT(user._id);
  return { message: "logged in sucessfully", token: token, user: user };
};
