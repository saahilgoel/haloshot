"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Gift,
  Users,
  Sparkles,
  ArrowRight,
  Mail,
  MessageCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// TODO: replace with real referral data
const mockReferral = {
  code: "SAAHIL20",
  link: "https://haloshot.ai/ref/SAAHIL20",
  invited: 3,
  signups: 1,
  rewarded: 5,
};

const steps = [
  {
    icon: Copy,
    title: "Share your link",
    description: "Send your unique referral link to friends and colleagues.",
  },
  {
    icon: Users,
    title: "They sign up",
    description: "When they create an account using your link, we track it.",
  },
  {
    icon: Sparkles,
    title: "Earn free headshots",
    description:
      "Get 5 free headshot generations for every friend who signs up.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function ReferPage() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(mockReferral.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Try HaloShot for AI headshots! Use my link: ${mockReferral.link}`
      )}`,
      "_blank"
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `I just discovered @HaloShot for AI headshots. Try it out: ${mockReferral.link}`
      )}`,
      "_blank"
    );
  };

  const shareEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(
        "Try HaloShot for AI headshots"
      )}&body=${encodeURIComponent(
        `Hey! I've been using HaloShot to generate professional headshots with AI. Check it out: ${mockReferral.link}`
      )}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400/10">
            <Gift className="h-5 w-5 text-lime-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Refer & Earn</h1>
            <p className="text-muted-foreground">
              Invite friends, earn free headshots.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Referral link card */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Referral Link</CardTitle>
            <CardDescription>
              Share this link and earn 5 free headshots for every signup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={mockReferral.link}
                className="font-mono text-sm"
              />
              <Button
                onClick={copyLink}
                variant="outline"
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {/* Share buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareWhatsApp}
                className="text-green-400"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={shareTwitter}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={shareEmail}>
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn}>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-violet-400">
                {mockReferral.invited}
              </p>
              <p className="text-xs text-muted-foreground">People Invited</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-lime-400">
                {mockReferral.signups}
              </p>
              <p className="text-xs text-muted-foreground">Signups</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">
                {mockReferral.rewarded}
              </p>
              <p className="text-xs text-muted-foreground">Free Headshots</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn}>
        <h2 className="mb-4 font-display text-lg font-semibold">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Card key={i}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
                    <Icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="mt-3 hidden h-4 w-4 text-muted-foreground sm:block" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Leaderboard placeholder */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Referral Leaderboard</CardTitle>
            <CardDescription>
              Top referrers this month. Keep sharing to climb the ranks!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Leaderboard coming soon. Keep referring to get a head start!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
