"use client";

import { motion } from "framer-motion";
import { HaloScoreWidget } from "@/components/halo/HaloScoreWidget";
import { HaloBreakdown } from "@/components/halo/HaloBreakdown";
import { RoastLine } from "@/components/halo/RoastLine";
import { ScoreShareCard } from "@/components/halo/ScoreShareCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Share2,
  Sun,
  Eye,
  Camera as CameraIcon,
  Briefcase,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface ScoreDetailClientProps {
  score: {
    id: string;
    overall_score: number;
    warmth_score: number;
    competence_score: number;
    trustworthiness_score: number;
    approachability_score: number;
    dominance_score: number;
    analysis_text: string;
    roast_line: string;
    improvement_tips: string[];
    lighting_quality: string;
    background_quality: string;
    expression_type: string;
    eye_contact: string;
    professional_readiness: string;
    photo_url: string | null;
    created_at: string;
  };
}

function qualityBadge(quality: string) {
  switch (quality) {
    case "excellent":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "good":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "fair":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "poor":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-white/5 text-white/50 border-white/10";
  }
}

export function ScoreDetailClient({ score }: ScoreDetailClientProps) {
  return (
    <div className="flex flex-col items-center gap-10 py-8 md:py-12 max-w-2xl mx-auto">
      {/* Score widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <HaloScoreWidget score={score.overall_score} size="lg" animated={true} />
      </motion.div>

      {/* Analysis text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center text-white/60 leading-relaxed max-w-md"
      >
        {score.analysis_text}
      </motion.p>

      {/* Meta badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        <Badge variant="outline" className={qualityBadge(score.lighting_quality)}>
          <Sun className="h-3 w-3 mr-1" />
          Lighting: {score.lighting_quality}
        </Badge>
        <Badge variant="outline" className={qualityBadge(score.background_quality)}>
          <CameraIcon className="h-3 w-3 mr-1" />
          Background: {score.background_quality}
        </Badge>
        <Badge variant="outline" className="bg-white/5 text-white/50 border-white/10">
          <Eye className="h-3 w-3 mr-1" />
          {score.eye_contact}
        </Badge>
        <Badge variant="outline" className="bg-white/5 text-white/50 border-white/10">
          <Briefcase className="h-3 w-3 mr-1" />
          {score.professional_readiness}
        </Badge>
      </motion.div>

      {/* Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full"
      >
        <h2 className="text-lg font-display font-semibold text-white mb-4">
          Score Breakdown
        </h2>
        <HaloBreakdown
          warmth={score.warmth_score}
          competence={score.competence_score}
          trustworthiness={score.trustworthiness_score}
          approachability={score.approachability_score}
          dominance={score.dominance_score}
          animated={true}
          delay={0.8}
        />
      </motion.div>

      {/* Roast */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="w-full"
      >
        <RoastLine text={score.roast_line} animated={false} />
      </motion.div>

      {/* Improvement tips */}
      {score.improvement_tips && score.improvement_tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="w-full space-y-3"
        >
          <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            Improvement Tips
          </h2>
          <div className="grid gap-3">
            {score.improvement_tips.map((tip, i) => (
              <Card
                key={i}
                className="bg-white/[0.03] border-white/[0.06] p-4"
              >
                <p className="text-sm text-white/70 leading-relaxed">
                  <span className="text-amber-400 font-mono font-bold mr-2">
                    {i + 1}.
                  </span>
                  {tip}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="flex flex-col items-center gap-3 pt-4"
      >
        <Button
          asChild
          size="lg"
          className="gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold px-8 h-12 text-base shadow-[0_0_20px_rgba(108,60,224,0.3)]"
        >
          <Link href="/generate">
            <Sparkles className="h-5 w-5" />
            Improve This Score
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-white/40"
          onClick={async () => {
            try {
              await navigator.share({
                title: `Halo Score: ${score.overall_score}`,
                url: window.location.href,
              });
            } catch {
              await navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          <Share2 className="h-4 w-4" />
          Share Score
        </Button>
      </motion.div>
    </div>
  );
}
