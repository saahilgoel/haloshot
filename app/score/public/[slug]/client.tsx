"use client";

import { motion } from "framer-motion";
import { ScoreShareCard } from "@/components/halo/ScoreShareCard";
import { HaloBreakdown } from "@/components/halo/HaloBreakdown";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface PublicScoreClientProps {
  score: {
    id: string;
    overall_score: number;
    warmth_score: number;
    competence_score: number;
    trustworthiness_score: number;
    approachability_score: number;
    dominance_score: number;
    roast_line: string;
    expression_type: string;
    professional_readiness: string;
    analysis_text: string;
  };
}

export function PublicScoreClient({ score }: PublicScoreClientProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0A0A0F] px-4 py-12">
      {/* Background ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(108, 60, 224, 0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-md">
        {/* Share card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScoreShareCard
            score={score.overall_score}
            roastLine={score.roast_line}
            expressionType={score.expression_type}
            professionalReadiness={score.professional_readiness}
          />
        </motion.div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <HaloBreakdown
            warmth={score.warmth_score}
            competence={score.competence_score}
            trustworthiness={score.trustworthiness_score}
            approachability={score.approachability_score}
            dominance={score.dominance_score}
            animated={true}
            delay={0.6}
          />
        </motion.div>

        {/* Analysis */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-white/40 leading-relaxed"
        >
          {score.analysis_text}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold px-8 h-12 text-base shadow-[0_0_20px_rgba(108,60,224,0.3)]"
          >
            <Link href="/score">
              <Sparkles className="h-5 w-5" />
              Get Your Own Halo Score Free
            </Link>
          </Button>

          <p className="text-xs text-white/20">
            AI-powered first impression analysis by HaloShot
          </p>
        </motion.div>
      </div>
    </div>
  );
}
