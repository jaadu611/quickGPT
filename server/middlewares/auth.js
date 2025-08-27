import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("auth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};
