export type SubscriptionTier = "free" | "pro" | "team";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "inactive";
export type JobStatus = "pending" | "processing" | "completed" | "failed";
export type TeamRole = "owner" | "admin" | "member";

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
  generations_count: number;
  referral_code: string | null;
  referred_by: string | null;
  team_id: string | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaceProfile {
  id: string;
  user_id: string;
  label: string;
  photo_urls: string[];
  embedding_status: "pending" | "processing" | "ready" | "failed";
  created_at: string;
  updated_at: string;
}

export interface GenerationJob {
  id: string;
  user_id: string;
  face_profile_id: string;
  style_preset_id: string | null;
  prompt: string;
  negative_prompt: string | null;
  status: JobStatus;
  progress: number;
  result_urls: string[];
  error_message: string | null;
  model_version: string;
  seed: number | null;
  parameters: Record<string, unknown>;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface SavedHeadshot {
  id: string;
  user_id: string;
  generation_job_id: string;
  image_url: string;
  thumbnail_url: string | null;
  is_favorite: boolean;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface StylePreset {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string;
  prompt_template: string;
  negative_prompt: string | null;
  category: string;
  is_premium: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  logo_url: string | null;
  max_members: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  invited_email: string | null;
  invited_at: string | null;
  joined_at: string | null;
  created_at: string;
}

export interface Waitlist {
  id: string;
  email: string;
  source: string | null;
  referred_by: string | null;
  position: number;
  approved: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  type: "bug" | "feature" | "general";
  message: string;
  rating: number | null;
  page_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ReferralEvent {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referral_code: string;
  event_type: "click" | "signup" | "conversion";
  reward_granted: boolean;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  description: string | null;
  enabled: boolean;
  rollout_percentage: number;
  allowed_emails: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ABTest {
  id: string;
  key: string;
  description: string | null;
  variants: Record<string, unknown>;
  traffic_allocation: Record<string, number>;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
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
  ip_address: string | null;
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
      style_presets: {
        Row: StylePreset;
        Insert: Omit<StylePreset, "id" | "created_at">;
        Update: Partial<StylePreset>;
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
        Insert: Omit<Waitlist, "id" | "created_at" | "position">;
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
        Insert: Omit<FeatureFlag, "id" | "created_at" | "updated_at">;
        Update: Partial<FeatureFlag>;
      };
      ab_tests: {
        Row: ABTest;
        Insert: Omit<ABTest, "id" | "created_at">;
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
    };
  };
}
