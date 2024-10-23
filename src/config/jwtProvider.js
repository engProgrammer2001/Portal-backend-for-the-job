import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const GenerateToken = (id) => {
  const token = jwt.sign({ userId: id }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

export default GenerateToken;
