import dotenv from "dotenv";
import User from "../models/user.js";
import { verifyToken } from "../utils/token.js";
import AppError from "../utils/AppError.js";
dotenv.config();

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      throw new AppError("please login ", 401);
    }
    const { id } = await verifyToken(token);

    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new AppError("you are not authorized for this action ",401);
    } else {
      req.user = user;
      next();
    }
};

export { userAuth };
