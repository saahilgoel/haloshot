"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RoastLineProps {
  text: string;
  animated?: boolean;
  delay?: number;
  className?: string;
}

export function RoastLine({
  text,
  animated = true,
  delay = 0,
  className,
}: RoastLineProps) {
  const [displayedText, setDisplayedText] = useState(animated ? "" : text);
  const [isComplete, setIsComplete] = useState(!animated);

  useEffect(() => {
    if (!animated) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, 35);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [text, animated, delay]);

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 10 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "relative rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] px-6 py-5",
        className
      )}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-2xl opacity-40" style={{
        boxShadow: "inset 0 0 30px rgba(245, 166, 35, 0.08)",
      }} />

      <p className="relative text-lg italic text-white/90 leading-relaxed">
        <span className="text-amber-400/60 text-2xl leading-none mr-1">&ldquo;</span>
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-[2px] h-[1.1em] bg-amber-400/70 ml-0.5 animate-pulse align-middle" />
        )}
        <span className="text-amber-400/60 text-2xl leading-none ml-1">&rdquo;</span>
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-3 text-xs font-medium tracking-wider uppercase text-amber-500/40"
      >
        &mdash; HaloShot
      </motion.p>
    </motion.div>
  );
}
