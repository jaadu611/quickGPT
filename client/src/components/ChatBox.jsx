import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const ChatBox = () => {
  const { selectedChat, theme, user, axios, token, setUser } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast.error("login to send message");
      setLoading(true);
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

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat._id, prompt, isPublished },
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

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const options = [
    { value: "text", label: "✏️ Text" },
    { value: "image", label: "🖼️ Image" },
  ];

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
        {mode === "image" && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 py-2 px-4 bg-white/60 dark:bg-[#2a193f]/60 backdrop-blur-md rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
              Publish Generated Image to Community
            </p>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <div className="w-8 h-4 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 transition-all shadow-inner" />
              <span className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full transition-all peer-checked:translate-x-4 shadow" />
            </label>
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-25 right-1/2 cursor-pointer translate-x-1/2 w-10 h-10 bg-primary/90 dark:bg-purple-800 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      )}

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 w-full mx-auto px-4 py-2 bg-primary/20 dark:bg-[#583c79]/30 border border-primary/40 dark:border-[#80609f]/40 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-primary transition"
      >
        {/* Custom Mode Select */}
        <div className="relative inline-block text-left w-28">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between cursor-pointer w-full px-3 py-2 text-sm bg-white dark:bg-purple-900/60 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-purple-800/70 focus:outline-none focus:ring-2 focus:ring-primary transition whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <span>{options.find((opt) => opt.value === mode)?.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute bottom-full mb-2 w-full rounded-xl shadow-lg bg-white dark:bg-purple-900/90 border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setMode(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-purple-800 transition ${
                    mode === opt.value
                      ? "bg-gray-100 dark:bg-purple-800 font-medium"
                      : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

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
