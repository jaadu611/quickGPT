import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const ChatBox = () => {
  const { selectedChat, theme, user, axios, token } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text"); // Keep mode if you still want text-only types
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast.error("login to send message");

      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      setLoading(true);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat._id, prompt },
        {
          headers: { Authorization: token },
        }
      );

      if (data.message) {
        setMessages((prev) => [...prev, data.reply]);
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 relative flex flex-col justify-between m-5 md:m-10 max-md:mt-14">
      <div
        ref={containerRef}
        className="flex-1 relative mb-5 overflow-y-scroll"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="logo"
              className="w-full max-w-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask Me Anything
            </p>
          </div>
        )}

        {messages.map((message, idx) => (
          <Message key={idx} message={message} />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5 border-3 rounded-full border-gray-600 w-fit p-4">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
          </div>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 w-full mx-auto px-4 py-2 bg-primary/20 dark:bg-[#583c79]/30 border border-primary/40 dark:border-[#80609f]/40 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-primary transition"
      >
        {/* Mode selector can be removed if you don't need text/image toggle */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500 h-[45px]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-full bg-primary cursor-pointer text-white dark:bg-[#80609f] hover:opacity-90 disabled:opacity-50 transition"
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="send"
            className="w-7 h-7"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
