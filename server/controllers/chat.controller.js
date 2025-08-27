import { Chat } from "../models/chat.model.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    await Chat.create({
      userId,
      messages: [],
      name: "New Chat",
      username: req.user.name,
    });

    res
      .status(200)
      .json({ success: true, message: "Chat created successfully" });
  } catch (error) {
    console.error("Create chat error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while creating chat" });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Get chats error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while getting chats" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({ _id: chatId, userId });

    res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.error("Delete chat error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while deleting chat" });
  }
};
