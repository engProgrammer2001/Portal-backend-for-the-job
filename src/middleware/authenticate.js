import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("Authorization header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "User Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token part after 'Bearer'
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);
    if (!decoded) {
      return res.status(401).json({ message: "User Unauthorized" });
    }
    req.id = decoded.userId;
    // console.log("User ID:", req.id);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export default isAuthenticated;
