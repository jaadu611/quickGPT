import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
// Import VS Code Dark+ theme
import "prismjs/themes/prism-tomorrow.css";

const Message = ({ message, onCopyCode }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      if (onCopyCode) onCopyCode(text);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const extractText = (children) => {
    if (!children) return "";
    if (typeof children === "string") return children;
    if (Array.isArray(children)) return children.map(extractText).join("");
    if (children.props && children.props.children)
      return extractText(children.props.children);
    return "";
  };

  const customMarkdownComponents = {
    pre: ({ children }, index) => {
      const codeText = extractText(children);
      const languageClass = children.props?.className || "language-javascript";

      return (
        <pre
          className={`relative group !bg-[#1e1e1e] !text-[#d4d4d4] p-4 rounded-lg overflow-x-auto text-sm border border-gray-600 font-mono leading-relaxed ${languageClass}`}
          style={{
            backgroundColor: "#1e1e1e !important",
            color: "#d4d4d4",
            fontFamily:
              "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
          }}
        >
          {children}
          <button
            onClick={() => handleCopy(codeText, index)}
            className={`absolute top-2 right-2 w-8 h-8 rounded-md ${
              copiedIndex === index
                ? "bg-green-600"
                : "bg-gray-700/90 hover:bg-gray-600"
            } text-white cursor-pointer transition-all duration-200 flex items-center justify-center backdrop-blur-sm`}
          >
            {copiedIndex === index ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>
        </pre>
      );
    },
  };

  return (
    <div className="w-full">
      {message.role === "user" ? (
        <div className="flex items-start justify-end my-6 gap-3">
          <div className="flex flex-col gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-[#57317c]/40 dark:to-[#6d4c8a]/40 border border-blue-200/60 dark:border-[#80609f]/40 rounded-2xl max-w-2xl shadow-sm backdrop-blur-sm">
            <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
              {message.content}
            </p>
            <span className="text-xs text-gray-500 dark:text-[#b1a6c0] self-end">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img
            src={assets.user_icon}
            alt="user_icon"
            className="w-10 h-10 rounded-full border-2 border-blue-200 dark:border-[#80609f] shadow-md"
          />
        </div>
      ) : (
        <div className="flex items-start gap-3 my-6">
          <div className="flex flex-col max-w-4xl bg-white/80 dark:bg-[#2a1a3e]/60 border border-gray-200/60 dark:border-[#80609f]/30 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
            <div className="p-5">
              {message.isImage ? (
                <img
                  src={message.content}
                  alt="AI generated content"
                  className="w-full max-w-md rounded-xl shadow-md"
                />
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <Markdown components={customMarkdownComponents}>
                    {message.content}
                  </Markdown>
                </div>
              )}
            </div>
            <div className="px-5 py-3 bg-gray-50/80 dark:bg-[#1a0f2e]/60 border-t border-gray-100/60 dark:border-[#80609f]/20 backdrop-blur-sm">
              <span className="text-xs text-gray-500 dark:text-[#b1a6c0]">
                {moment(message.timestamp).fromNow()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
