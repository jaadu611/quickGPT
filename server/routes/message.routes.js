import express from "express";
import {
  imageMessageController,
  textMessageController,
} from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.js";

const messageRoute = express.Router();

messageRoute.post("/text", protect, textMessageController);
messageRoute.post("/image", protect, imageMessageController);

export default messageRoute;
