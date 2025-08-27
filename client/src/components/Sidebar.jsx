import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUserChats,
    setToken,
    token,
  } = useAppContext();

  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.clear("token");
    setToken(null);
    toast.success("Logged out successfuly");
  };

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        {
          headers: { Authorization: token },
        }
      );

      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUserChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col justify-center h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609f]/30 backdrop-blur-3xl transition-all max-md:absolute left-0 z-1 ${
        !isMenuOpen && "max-md:-translate-x-full"
      }`}
    >
      <div className="flex justify-between">
        <img
          src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
          alt="logo"
          className="w-full max-w-48"
        />

        <img
          src={assets.close_icon}
          alt="close_icon"
          className="w-5 h-5 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(false)}
        />
      </div>

      <button
        onClick={createNewChat}
        className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#a456f7] to-[#3d81f6] text-sm rounded-md cursor-pointer"
      >
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      <div className="flex items-center gap-2 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
        <img
          src={assets.search_icon}
          alt="search_icon"
          className="w-4 not-dark:invert my-3 ml-3"
        />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversations"
          className="text-xs placeholder:text-gray-400 outline-none h-full w-full pr-3"
        />
      </div>

      {chats.length > 0 && <p className="text-sm mt-4">Recent Chats</p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
                setSelectedChat(chat);
              }}
              key={chat._id}
              className="p-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between group"
            >
              <div>
                <p className="truncate w-fit">
                  {chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 2].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#b1a6c0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              <img
                onClick={(e) =>
                  toast.promise(deleteChat(e, chat._id), {
                    loading: "deleting...",
                  })
                }
                src={assets.bin_icon}
                alt="bin_icon"
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
              />
            </div>
          ))}
      </div>

      <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img
            src={assets.theme_icon}
            alt="theme_icon"
            className="w-4 not-dark:invert"
          />
          <p>{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
        </div>
        <label className="relative inline-flex cursor-pointer">
          <input
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all" />
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-4" />
        </label>
      </div>

      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <img
          src={assets.user_icon}
          alt="gallery_icon"
          className="w-4.5 rounded-full"
        />
        <p className="flex flex-1 text-sm w-full justify-between items-center dark:text-primary truncate">
          {user ? user.name : "Login Your Account"}
          {user && (
            <img
              onClick={logout}
              className="h-5 cursor-pointer hidden not-dark:invert group-hover:block"
              src={assets.logout_icon}
            />
          )}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
