/**
 * Seed script: Insert all nudge messages into the nudge_messages table.
 *
 * Run via: npx tsx seed/nudges.ts
 * Or: npm run seed:nudges
 */

import { createAdminClient } from "../lib/supabase/admin";

interface NudgeSeed {
  message: string;
  category: "halo_decay" | "psychology_facts" | "social_proof" | "fomo" | "seasonal";
  target_tier: "free" | "pro" | "team" | "all";
  target_days_since_generation: number | null;
}

const NUDGE_MESSAGES: NudgeSeed[] = [
  // ---- halo_decay ----
  {
    message:
      "Your Halo Score was 8.2 last month. Photos age faster than you think -- refresh your headshot to stay at peak first impression.",
    category: "halo_decay",
    target_tier: "all",
    target_days_since_generation: 30,
  },
  {
    message:
      "It has been 60 days since your last generation. LinkedIn profiles with recent photos get 21x more views. Time for a refresh?",
    category: "halo_decay",
    target_tier: "all",
    target_days_since_generation: 60,
  },
  {
    message:
      "Your headshot is 90 days old. In that time, 47,000 people may have formed a first impression of you. Make sure it is your best one.",
    category: "halo_decay",
    target_tier: "all",
    target_days_since_generation: 90,
  },
  {
    message:
      "Quick check: does your current headshot still represent how you show up today? Your Halo Score might surprise you.",
    category: "halo_decay",
    target_tier: "free",
    target_days_since_generation: 14,
  },
  {
    message:
      "Photos lose impact over time. The good news? A fresh HaloShot takes 30 seconds and the glow-up is instant.",
    category: "halo_decay",
    target_tier: "all",
    target_days_since_generation: 45,
  },

  // ---- psychology_facts ----
  {
    message:
      "Research: it takes 100ms to form a first impression from a photo. That is 0.1 seconds to win or lose an opportunity. Is your headshot doing the work?",
    category: "psychology_facts",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "The Halo Effect is real: people rated as attractive in photos are also perceived as more competent, trustworthy, and likeable. Your face is your resume.",
    category: "psychology_facts",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Princeton study: Warmth and Competence are the two dimensions people judge instantly from your face. Your Halo Score measures both.",
    category: "psychology_facts",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Fun fact: photos with genuine Duchenne smiles (eyes + mouth) score 31% higher on Trust. Our AI optimizes for exactly this.",
    category: "psychology_facts",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "People decide whether to swipe right in 0.35 seconds. Your Main Character preset is engineered for that exact window.",
    category: "psychology_facts",
    target_tier: "all",
    target_days_since_generation: null,
  },

  // ---- social_proof ----
  {
    message:
      "2,847 headshots generated this week. The most popular glow-up? Founder Mode preset with an average +4.2 Halo Score jump.",
    category: "social_proof",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "A founder just went from Halo 5.8 to 9.1 using the Founder Mode preset. Their LinkedIn connection acceptance rate doubled.",
    category: "social_proof",
    target_tier: "free",
    target_days_since_generation: null,
  },
  {
    message:
      "Last month, HaloShot users collectively improved their Halo Scores by 12,400 points. The average glow-up delta: +3.4.",
    category: "social_proof",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Real estate agents using The Listing Agent preset report 28% more listing inquiries. Your headshot is literally worth money.",
    category: "social_proof",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Users who run Help Me Pick polls choose photos that score 1.2 points higher than their own gut pick. The crowd knows.",
    category: "social_proof",
    target_tier: "pro",
    target_days_since_generation: null,
  },

  // ---- fomo ----
  {
    message:
      "While you are reading this, 14 people just upgraded their headshots. Your competitors are not waiting.",
    category: "fomo",
    target_tier: "free",
    target_days_since_generation: 7,
  },
  {
    message:
      "New preset just dropped: Scroll Stopper. Early users are seeing 4.2x more profile visits. Be one of the first.",
    category: "fomo",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Pro users get unlimited generations. The average Pro user generates 3.2 sets per month. They are always putting their best face forward.",
    category: "fomo",
    target_tier: "free",
    target_days_since_generation: null,
  },
  {
    message:
      "Your free generation is waiting. 89% of users who try one generation come back for more. See what the hype is about.",
    category: "fomo",
    target_tier: "free",
    target_days_since_generation: null,
  },
  {
    message:
      "The Desi Professional preset just launched and it is already our fastest-growing style. Skin-tone-optimized lighting changes everything.",
    category: "fomo",
    target_tier: "all",
    target_days_since_generation: null,
  },

  // ---- seasonal ----
  {
    message:
      "New year, new headshot. January is the #1 month for LinkedIn profile updates. Start the year with a fresh Halo Score.",
    category: "seasonal",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Conference season is here. Update your speaker headshot before your next event -- The Closer preset was made for this.",
    category: "seasonal",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Summer is peak dating season. Your Main Character preset photo could be the difference between a match and a miss.",
    category: "seasonal",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Q4 hiring season: recruiters are scanning 200+ profiles a day. A high Halo Score headshot gets you noticed in the first scroll.",
    category: "seasonal",
    target_tier: "all",
    target_days_since_generation: null,
  },
  {
    message:
      "Holiday party photos hitting your feed? Make sure your professional headshot is sharper than your cousin's iPhone portrait.",
    category: "seasonal",
    target_tier: "all",
    target_days_since_generation: null,
  },
];

async function seedNudges() {
  const nudges = NUDGE_MESSAGES.map((nudge) => ({
    message: nudge.message,
    category: nudge.category,
    target_tier: nudge.target_tier,
    target_days_since_generation: nudge.target_days_since_generation,
    sent_count: 0,
    click_count: 0,
    conversion_count: 0,
    is_active: true,
  }));

  console.log(`Seeding ${nudges.length} nudge messages...`);

  const supabase = createAdminClient();

  // Clear existing nudges and insert fresh
  const { error: deleteError } = await supabase
    .from("nudge_messages")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all rows

  if (deleteError) {
    console.error("Failed to clear existing nudges:", deleteError);
  }

  const { data, error } = await supabase
    .from("nudge_messages")
    .insert(nudges);

  if (error) {
    console.error("Failed to seed nudges:", error);
    process.exit(1);
  }

  console.log(
    `Successfully seeded ${nudges.length} nudge messages across categories:`,
    Array.from(new Set(nudges.map((n) => n.category))).join(", ")
  );
  process.exit(0);
}

seedNudges();
