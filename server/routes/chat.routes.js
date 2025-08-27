import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createChat,
  deleteChat,
  getChats,
} from "../controllers/chat.controller.js";

const chatRoute = express.Router();

chatRoute.get("/create", protect, createChat);
chatRoute.get("/get", protect, getChats);
chatRoute.post("/delete", protect, deleteChat);

export default chatRoute;
