import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/data", protect, getUser);

export default userRoute;
