import dotenv from "dotenv";
import User from "../models/user.js";
import { verifyToken } from "../utils/token.js";
dotenv.config();

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ success: false, message: "please log in" });
    }
    const { id } = await verifyToken(token);

    const user = await User.findOne({ _id: id });
    if (!user) {
      res
        .status(401)
        .json({
          success: false,
          message: "you are not authorized for this action ",
        });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send("ERROR" + err);
  }
};

export { userAuth };
