import jwt from "jsonwebtoken";
export const createJWT = async function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};
