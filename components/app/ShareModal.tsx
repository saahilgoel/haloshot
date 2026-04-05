"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, MessageCircle, Twitter, Linkedin, Mail, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  shareUrl?: string;
}

export function ShareModal({ isOpen, onClose, imageUrl, shareUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const url = shareUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/s/shared`;
  const text = "Just got my new AI headshot in 60 seconds with HaloShot!";

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-emerald-600",
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`),
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`),
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600",
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-white/10",
      onClick: () => window.open(`mailto:?subject=${encodeURIComponent("Check out my AI headshot!")}&body=${encodeURIComponent(text + "\n\n" + url)}`),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl md:rounded-3xl bg-[#1a1025] border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-white">Share your headshot</h3>
              <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Image preview */}
            <div className="flex justify-center mb-6">
              <img
                src={imageUrl}
                alt="Headshot to share"
                className="h-32 w-32 rounded-2xl object-cover ring-2 ring-violet-500/30"
              />
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.onClick}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`h-12 w-12 rounded-full ${option.color} flex items-center justify-center`}>
                    <option.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-white/50">{option.name}</span>
                </button>
              ))}
            </div>

            {/* Copy link */}
            <div className="flex gap-2">
              <Input
                value={url}
                readOnly
                className="text-sm bg-white/5 border-white/10"
              />
              <Button
                onClick={copyLink}
                variant="outline"
                className="shrink-0 gap-2"
              >
                {copied ? (
                  <><Check className="h-4 w-4" /> Copied</>
                ) : (
                  <><Copy className="h-4 w-4" /> Copy</>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
