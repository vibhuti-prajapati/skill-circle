import jwt from "jsonwebtoken";
export const createJWT = async (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

export const verifyToken =  async (token)=>{
  return jwt.verify(token, process.env.JWT_SECRET); 
}