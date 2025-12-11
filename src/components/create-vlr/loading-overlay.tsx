"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

type LoadingOverlayProps = {
  messages: string[];
  duration: number;
  onComplete: () => void;
  isActive: boolean;
};

export function LoadingOverlay({
  messages,
  duration,
  onComplete,
  isActive,
}: LoadingOverlayProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentMessageIndex(0);
      return;
    }

    const messageInterval = duration / messages.length;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev >= messages.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, messageInterval);

    const timeout = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, duration, messages.length, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="flex flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl sm:p-10"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100"
          >
            <Loader2 className="h-8 w-8 text-sky-600" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-sky-400/20 blur-xl"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center text-lg font-medium text-slate-700"
            >
              {messages[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
          <p className="text-sm text-slate-500">Please wait...</p>
        </div>

        <div className="flex gap-1.5">
          {messages.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${
                index <= currentMessageIndex ? "bg-sky-500" : "bg-slate-200"
              }`}
              animate={
                index === currentMessageIndex
                  ? { scale: [1, 1.3, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.5, repeat: index === currentMessageIndex ? Infinity : 0 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
