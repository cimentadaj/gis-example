"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import type { ChatMessage } from "@/data/create-vlr";

type VlrChatBoxProps = {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  placeholder?: string;
  compact?: boolean;
};

export function VlrChatBox({
  messages,
  onSendMessage,
  placeholder = "Type your message...",
  compact = false,
}: VlrChatBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border border-slate-200 bg-white ${
        compact ? "h-full" : "h-80"
      }`}
    >
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100">
            <Bot className="h-4 w-4 text-sky-600" />
          </span>
          <span className="text-sm font-medium text-slate-700">
            VLR Assistant
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full items-center justify-center"
            >
              <p className="text-center text-sm text-slate-400">
                Ask questions or request changes to the data
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-slate-100"
                        : "bg-sky-100"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-3.5 w-3.5 text-slate-600" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-sky-600" />
                    )}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-slate-100 text-slate-700"
                        : "border border-sky-200 bg-sky-50 text-slate-700"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
