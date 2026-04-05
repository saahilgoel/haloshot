export type SubscriptionTier = "free" | "pro" | "team";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "inactive";
export type JobStatus = "pending" | "processing" | "completed" | "failed";
export type TeamRole = "owner" | "admin" | "member";
export type NudgeCategory = "halo_decay" | "psychology_facts" | "social_proof" | "fomo" | "seasonal";
export type HaloScoreSource = "upload" | "generation" | "external";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  subscription_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  generations_count_total: number;
  generations_count_month: number;
  generations_reset_at: string;
  current_halo_score: number | null;
  current_halo_breakdown: HaloBreakdown | null;
  halo_score_updated_at: string | null;
  primary_use_case: string | null;
  onboarding_completed: boolean;
  preferred_styles: string[];
  referral_code: string | null;
  referred_by: string | null;
  referral_credits: number;
  locale: string;
  timezone: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  updated_at: string;
}

export interface HaloBreakdown {
  warmth: number;
  competence: number;
  trust: number;
  approachability: number;
  dominance: number;
}

export interface HaloScore {
  id: string;
  user_id: string;
  photo_url: string;
  overall_score: number;
  warmth: number;
  competence: number;
  trust: number;
  approachability: number;
  dominance: number;
  analysis_text: string | null;
  roast_line: string | null;
  improvement_tips: string[];
  lighting_quality: number | null;
  background_quality: number | null;
  expression_quality: number | null;
  source: HaloScoreSource;
  generation_job_id: string | null;
  created_at: string;
}

export interface FaceProfile {
  id: string;
  user_id: string;
  photo_urls: string[];
  face_embedding: number[] | null;
  detected_features: Record<string, unknown> | null;
  status: "processing" | "ready" | "failed";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GenerationJob {
  id: string;
  user_id: string;
  face_profile_id: string;
  preset_id: string;
  custom_prompt: string | null;
  style_options: Record<string, unknown>;
  num_images: number;
  replicate_prediction_id: string | null;
  model_version: string | null;
  status: "queued" | "processing" | "completed" | "failed" | "canceled";
  generated_image_urls: string[];
  similarity_scores: number[];
  processing_time_ms: number | null;
  error_message: string | null;
  halo_scores: number[];
  before_halo_score: number | null;
  best_after_halo_score: number | null;
  glow_up_delta: number | null;
  cost_usd: number;
  created_at: string;
  completed_at: string | null;
}

export interface SavedHeadshot {
  id: string;
  user_id: string;
  generation_job_id: string | null;
  original_url: string;
  edited_url: string | null;
  thumbnail_url: string | null;
  halo_score: number | null;
  vote_link_slug: string | null;
  vote_count_total: number;
  vote_count_positive: number;
  preset_id: string | null;
  resolution: string;
  is_favorite: boolean;
  download_count: number;
  public_share_slug: string | null;
  share_enabled: boolean;
  created_at: string;
}

export interface PhotoVote {
  id: string;
  user_id: string;
  photo_a_url: string;
  photo_b_url: string;
  votes_a: number;
  votes_b: number;
  share_slug: string;
  expires_at: string | null;
  created_at: string;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon_emoji: string | null;
  preview_images: string[];
  prompt_template: string;
  negative_prompt: string | null;
  style_config: Record<string, unknown>;
  halo_pitch: string | null;
  is_free: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface NudgeMessage {
  id: string;
  message: string;
  category: NudgeCategory;
  target_tier: "free" | "pro" | "team" | "all" | null;
  target_days_since_generation: number | null;
  sent_count: number;
  click_count: number;
  conversion_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  logo_url: string | null;
  brand_colors: Record<string, string>;
  brand_guidelines: string | null;
  default_preset_id: string | null;
  default_background: string | null;
  max_members: number;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  invite_email: string | null;
  invite_status: "pending" | "accepted" | "declined";
  joined_at: string | null;
  created_at: string;
}

export interface Waitlist {
  id: string;
  email: string;
  name: string | null;
  use_case: string | null;
  current_photo_url: string | null;
  halo_score: number | null;
  source: string | null;
  referral_code: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: "waiting" | "invited" | "converted";
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  type: "nps" | "bug" | "feature_request" | "quality_report" | "general";
  rating: number | null;
  message: string | null;
  generation_job_id: string | null;
  page_url: string | null;
  created_at: string;
}

export interface ReferralEvent {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referred_email: string | null;
  event_type: "click" | "signup" | "trial" | "conversion";
  reward_granted: boolean;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  description: string | null;
  enabled: boolean;
  rollout_percentage: number;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ABTest {
  id: string;
  description: string | null;
  variants: Record<string, unknown>;
  target_metric: string | null;
  status: "draft" | "running" | "completed";
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  session_id: string | null;
  event_name: string;
  event_properties: Record<string, unknown>;
  page_url: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_country: string | null;
  ip_city: string | null;
  created_at: string;
}

// Supabase Database type helper for typed client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
      };
      face_profiles: {
        Row: FaceProfile;
        Insert: Omit<FaceProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<FaceProfile>;
      };
      halo_scores: {
        Row: HaloScore;
        Insert: Omit<HaloScore, "id" | "created_at">;
        Update: Partial<HaloScore>;
      };
      generation_jobs: {
        Row: GenerationJob;
        Insert: Omit<GenerationJob, "id" | "created_at">;
        Update: Partial<GenerationJob>;
      };
      saved_headshots: {
        Row: SavedHeadshot;
        Insert: Omit<SavedHeadshot, "id" | "created_at">;
        Update: Partial<SavedHeadshot>;
      };
      photo_votes: {
        Row: PhotoVote;
        Insert: Omit<PhotoVote, "id" | "created_at">;
        Update: Partial<PhotoVote>;
      };
      style_presets: {
        Row: StylePreset;
        Insert: Omit<StylePreset, "created_at" | "updated_at">;
        Update: Partial<StylePreset>;
      };
      nudge_messages: {
        Row: NudgeMessage;
        Insert: Omit<NudgeMessage, "id" | "created_at" | "updated_at">;
        Update: Partial<NudgeMessage>;
      };
      teams: {
        Row: Team;
        Insert: Omit<Team, "id" | "created_at" | "updated_at">;
        Update: Partial<Team>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, "id" | "created_at">;
        Update: Partial<TeamMember>;
      };
      waitlist: {
        Row: Waitlist;
        Insert: Omit<Waitlist, "id" | "created_at">;
        Update: Partial<Waitlist>;
      };
      feedback: {
        Row: Feedback;
        Insert: Omit<Feedback, "id" | "created_at">;
        Update: Partial<Feedback>;
      };
      referral_events: {
        Row: ReferralEvent;
        Insert: Omit<ReferralEvent, "id" | "created_at">;
        Update: Partial<ReferralEvent>;
      };
      feature_flags: {
        Row: FeatureFlag;
        Insert: Omit<FeatureFlag, "created_at" | "updated_at">;
        Update: Partial<FeatureFlag>;
      };
      ab_tests: {
        Row: ABTest;
        Insert: Omit<ABTest, "created_at">;
        Update: Partial<ABTest>;
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, "id" | "created_at">;
        Update: Partial<AnalyticsEvent>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      subscription_tier: SubscriptionTier;
      subscription_status: SubscriptionStatus;
      job_status: JobStatus;
      team_role: TeamRole;
      nudge_category: NudgeCategory;
      halo_score_source: HaloScoreSource;
    };
  };
}
