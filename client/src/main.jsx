import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";

function Root() {
  useEffect(() => {
    const appWrapper = document.getElementById("root");

    function updateHeight() {
      if (appWrapper) appWrapper.style.height = `${window.innerHeight}px`;
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
