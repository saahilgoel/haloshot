"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"nps" | "bug" | "feature_request" | "general">("general");
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        rating,
        message,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      }),
    });
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setMessage("");
      setRating(null);
    }, 2000);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 h-12 w-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 flex items-center justify-center transition-all z-40"
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 md:bottom-20 md:right-6 w-80 rounded-2xl bg-[#1a1025] border border-white/10 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="font-display font-semibold text-white text-sm">Send Feedback</h3>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center">
                <p className="text-lg">Thank you!</p>
                <p className="text-sm text-white/50 mt-1">Your feedback helps us improve.</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Type pills */}
                <div className="flex flex-wrap gap-1.5">
                  {(["general", "bug", "feature_request", "nps"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-all",
                        type === t
                          ? "bg-violet-600 text-white"
                          : "bg-white/5 text-white/50 hover:bg-white/10"
                      )}
                    >
                      {t === "feature_request" ? "Feature" : t === "nps" ? "Rating" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {/* NPS rating */}
                {type === "nps" && (
                  <div>
                    <p className="text-xs text-white/50 mb-2">How likely are you to recommend HaloShot?</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => setRating(n)}
                          className={cn(
                            "h-8 w-8 rounded-lg text-xs font-medium transition-all",
                            rating === n
                              ? n <= 6 ? "bg-rose-500 text-white" : n <= 8 ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                              : "bg-white/5 text-white/40 hover:bg-white/10"
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows={3}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-violet-500"
                />

                <Button
                  onClick={submit}
                  disabled={!message.trim() && !rating}
                  className="w-full bg-violet-600 hover:bg-violet-700 gap-2"
                  size="sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Feedback
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
