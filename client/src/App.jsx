import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import React, { useState } from "react";
import ChatBox from "./components/ChatBox.jsx";
import { assets } from "./assets/assets.js";
import "./assets/prism.css";
import Loading from "./pages/Loading.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import Login from "./pages/login.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loadingUser } = useAppContext();
  if (loadingUser) return <Loading />;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
