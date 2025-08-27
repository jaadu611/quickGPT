import { Chat } from "../models/chat.model.js";
import groq from "../configs/groq.js";
import axios from "axios";
import imagekit from "../configs/imagekit.js";
import FormData from "form-data";

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiReply = completion.choices?.[0]?.message?.content || "No response";

    const reply = {
      role: "assistant",
      content: aiReply,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);

    res.status(200).json({
      success: true,
      message: "Message processed",
      reply,
    });

    chat
      .save()
      .catch((err) => console.error("Failed to save chat:", err.message));
  } catch (error) {
    console.error(
      "text message error:",
      error?.response?.data || error.message
    );
    return res
      .status(500)
      .json({ success: false, message: "Error while messaging" });
  }
};

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", "png");
    form.append("height", 512);
    form.append("width", 512);
    form.append("samples", 1);

    const aiResponse = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
      }
    );

    const contentType = aiResponse.headers["content-type"];

    if (!contentType.startsWith("image/")) {
      const errorText = Buffer.from(aiResponse.data).toString("utf8");
      throw new Error(`Stability API error: ${errorText}`);
    }

    const imageBuffer = Buffer.from(aiResponse.data, "binary");

    const uploadResponse = await imagekit.upload({
      file: imageBuffer,
      fileName: `chat-${chatId}-${Date.now()}.png`,
      folder: "ai-chats",
    });

    const imageUrl = uploadResponse.url;

    const reply = {
      role: "assistant",
      content: imageUrl,
      timestamp: Date.now(),
      isImage: true,
    };

    res.status(200).json({
      success: true,
      message: "Image generated successfully",
      reply,
    });

    chat.messages.push(reply);

    await chat.save();
  } catch (error) {
    console.error(
      "image message error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({ success: false, message: error.message });
  }
};
