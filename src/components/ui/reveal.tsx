"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
  amount?: number;
  once?: boolean;
  offset?: number;
};

const defaultTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.35,
  once = true,
  offset = 24,
  ...rest
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...rest}
      className={cn(className)}
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : offset,
        filter: shouldReduceMotion ? "blur(0px)" : "blur(12px)",
      }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ ...defaultTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
