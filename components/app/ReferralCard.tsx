"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, MessageCircle, Twitter, Mail, Users, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReferralCardProps {
  referralCode: string;
  stats: {
    clicks: number;
    signups: number;
    conversions: number;
  };
  credits: number;
}

export function ReferralCard({ referralCode, stats, credits }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://haloshot.app/r/${referralCode}`;
  const shareText = "Get professional AI headshots in 60 seconds! Use my referral link for 5 free headshots:";

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-violet-600/20 to-violet-900/20 border-violet-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Gift className="h-5 w-5 text-lime-400" />
          Invite Friends, Earn Free Headshots
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Invited", value: stats.clicks, icon: Users },
            { label: "Signed Up", value: stats.signups, icon: TrendingUp },
            { label: "Credits", value: credits, icon: Zap },
          ].map((stat) => (
            <div key={stat.label} className="text-center rounded-xl bg-white/5 p-3">
              <stat.icon className="h-4 w-4 text-violet-400 mx-auto mb-1" />
              <p className="text-lg font-display font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Link */}
        <div className="flex gap-2">
          <Input value={shareUrl} readOnly className="bg-white/5 border-white/10 text-sm" />
          <Button onClick={copy} variant="outline" className="shrink-0 gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 bg-emerald-600/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`)}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)}
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => window.open(`mailto:?subject=Check out HaloShot!&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`)}
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
        </div>

        {/* How it works */}
        <div className="border-t border-white/5 pt-4">
          <p className="text-xs text-white/40 font-medium mb-2">HOW IT WORKS</p>
          <div className="space-y-2 text-xs text-white/50">
            <p>1. Share your link with friends</p>
            <p>2. They get 5 free Pro headshots when they sign up</p>
            <p>3. You get 5 free Pro headshots for each signup</p>
            <p>4. If they upgrade to Pro, you get 1 month free!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
