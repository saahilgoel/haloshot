"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  MessageCircle,
  Twitter,
  Share2,
  Link2,
  ArrowRight,
  Vote,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PollCreator } from "@/components/pick/PollCreator";
import { cn } from "@/lib/utils";

interface Headshot {
  id: string;
  url: string;
  presetName?: string;
  haloScore?: number;
}

// TODO: Replace with real data from Supabase
const mockHeadshots: Headshot[] = [
  { id: "1", url: "/placeholder-headshot-1.jpg", presetName: "Corporate", haloScore: 82 },
  { id: "2", url: "/placeholder-headshot-2.jpg", presetName: "Casual", haloScore: 76 },
  { id: "3", url: "/placeholder-headshot-3.jpg", presetName: "Creative", haloScore: 91 },
  { id: "4", url: "/placeholder-headshot-4.jpg", presetName: "LinkedIn", haloScore: 68 },
  { id: "5", url: "/placeholder-headshot-5.jpg", presetName: "Founder", haloScore: 87 },
  { id: "6", url: "/placeholder-headshot-6.jpg", presetName: "Editorial" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function NewPollPage() {
  const [selectedPair, setSelectedPair] = useState<
    [Headshot, Headshot] | null
  >(null);
  const [pollCreated, setPollCreated] = useState(false);
  const [pollSlug, setPollSlug] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const pollUrl = pollSlug ? `${origin}/pick/${pollSlug}` : "";

  const createPoll = async () => {
    if (!selectedPair) return;
    setIsCreating(true);

    // TODO: Replace with real API call to create poll in Supabase
    await new Promise((r) => setTimeout(r, 800));
    const slug =
      Math.random().toString(36).substring(2, 8) +
      Math.random().toString(36).substring(2, 4);
    setPollSlug(slug);
    setPollCreated(true);
    setIsCreating(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = "Which photo makes a better first impression? Help me pick:";

  const shareOptions = [
    {
      name: "Copy link",
      icon: copied ? Check : Copy,
      color: "bg-white/10",
      onClick: copyLink,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-emerald-600",
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + " " + pollUrl)}`
        ),
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pollUrl)}`
        ),
    },
    {
      name: "iMessage",
      icon: Share2,
      color: "bg-blue-500",
      onClick: () =>
        window.open(`sms:&body=${encodeURIComponent(shareText + " " + pollUrl)}`),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Let the people decide.
        </h1>
        <p className="mt-2 max-w-lg text-white/50">
          Pick two photos. Share the link. Get honest votes. No signup needed
          for voters.
        </p>
      </motion.div>

      {/* Poll creator or share UI */}
      <AnimatePresence mode="wait">
        {!pollCreated ? (
          <motion.div
            key="creator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <PollCreator
                headshots={mockHeadshots}
                selectedPair={selectedPair}
                onSelectionChange={setSelectedPair}
              />
            </motion.div>

            {/* Create button */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8"
            >
              <Button
                onClick={createPoll}
                disabled={!selectedPair || isCreating}
                size="lg"
                className={cn(
                  "w-full gap-2 rounded-xl py-6 text-base font-semibold transition-all sm:w-auto sm:px-12",
                  selectedPair
                    ? "bg-violet-600 hover:bg-violet-500 shadow-[0_0_30px_rgba(108,60,224,0.3)]"
                    : "bg-white/10 text-white/30"
                )}
              >
                {isCreating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                ) : (
                  <>
                    <Vote className="h-5 w-5" />
                    Create Poll
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Success state */}
            <Card className="overflow-hidden border-violet-500/30 bg-gradient-to-br from-violet-950/50 to-[#0a0a14]">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600"
                >
                  <Check className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="mb-2 font-display text-2xl font-bold text-white">
                  Poll created
                </h2>
                <p className="mb-6 text-sm text-white/50">
                  Share the link and let people vote. Results update in
                  real-time.
                </p>

                {/* Link display */}
                <div className="mx-auto mb-6 flex max-w-md items-center gap-2 rounded-xl bg-white/5 p-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/20">
                    <Link2 className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="flex-1 truncate text-left text-sm text-white/70">
                    {pollUrl}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyLink}
                    className="shrink-0 text-violet-400 hover:text-violet-300"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Share options */}
                <div className="flex justify-center gap-4">
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={option.onClick}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110",
                          option.color
                        )}
                      >
                        <option.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[11px] text-white/40">
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview of the poll */}
            <div>
              <p className="mb-3 text-sm text-white/40">Preview</p>
              <div className="grid grid-cols-2 gap-4">
                {selectedPair?.map((photo, idx) => (
                  <Card
                    key={photo.id}
                    className="overflow-hidden border-white/10"
                  >
                    <div className="relative aspect-[3/4]">
                      <img
                        src={photo.url}
                        alt={`Photo ${idx === 0 ? "A" : "B"}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-2 top-2 rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-bold text-white">
                        Photo {idx === 0 ? "A" : "B"}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* View results link */}
            <Button
              variant="outline"
              className="w-full gap-2 border-white/10 text-white/60 hover:text-white"
            >
              View live results
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
