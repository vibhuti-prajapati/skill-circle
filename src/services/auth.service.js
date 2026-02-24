import { hashPassword } from "../utils/hash.js";
import User from '../models/user.js'
import { validateEmail } from "../utils/validateEmail.js";
import { createJWT } from "../utils/token.js";

export const signUp = async ({ name, email, password }) => {
  if (!validateEmail(email)) {
    throw new Error("email format is not valid!");
  }
  const checkEmailExist = await User.find({ email });
  if (checkEmailExist.length > 0) {
    throw new Error("email already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  return { message: "User created successfully" };
};

export const login = async ({ email, password }) => {
  if (!validateEmail(email)) {
    throw new Error("email format is not valid!");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("invalid credentials");
  }
  const isPasswordValid = user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("invalid credentials");
  }
  const token = await createJWT(user._id);
  return { message: "logged in sucessfully", token: token, user: user };
};
