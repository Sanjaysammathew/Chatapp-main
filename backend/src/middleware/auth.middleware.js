import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      console.log("JWT verification error:", err.message);
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token", error: err.message });
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
