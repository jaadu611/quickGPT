import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    messages: [
      {
        isImage: { type: Boolean, required: true },
        role: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
