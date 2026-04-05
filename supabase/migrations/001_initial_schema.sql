-- ============================================
-- HaloShot -- Initial Database Schema (v2)
-- ============================================

-- Enable pgvector extension for face embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- USERS & AUTH
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_period_end TIMESTAMPTZ,
  -- Usage tracking
  generations_count_total INTEGER DEFAULT 0,
  generations_count_month INTEGER DEFAULT 0,
  generations_reset_at TIMESTAMPTZ DEFAULT NOW(),
  -- Halo Score
  current_halo_score NUMERIC(5, 2),
  current_halo_breakdown JSONB DEFAULT '{}', -- {warmth, competence, trust, approachability, dominance}
  halo_score_updated_at TIMESTAMPTZ,
  primary_use_case TEXT, -- 'linkedin', 'dating', 'creative', 'corporate', etc.
  -- Profile
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferred_styles TEXT[] DEFAULT '{}',
  -- Referral
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  referral_credits INTEGER DEFAULT 0,
  -- Metadata
  locale TEXT DEFAULT 'en',
  timezone TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FACE PROFILES (user's reference photos + embeddings)
-- ============================================

CREATE TABLE public.face_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Reference photos
  photo_urls TEXT[] NOT NULL, -- Array of uploaded selfie URLs
  -- AI-extracted data
  face_embedding VECTOR(512), -- InsightFace ArcFace embedding for similarity scoring
  detected_features JSONB, -- {skin_tone, hair_color, eye_color, glasses, facial_hair, face_shape}
  -- Status
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
  is_active BOOLEAN DEFAULT TRUE,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_face_profiles_user ON public.face_profiles(user_id);

-- ============================================
-- HALO SCORES (photo analysis results)
-- ============================================

CREATE TABLE public.halo_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  -- Overall score
  overall_score NUMERIC(5, 2) NOT NULL,
  -- Dimension scores (0-10 scale)
  warmth NUMERIC(4, 2) NOT NULL,
  competence NUMERIC(4, 2) NOT NULL,
  trust NUMERIC(4, 2) NOT NULL,
  approachability NUMERIC(4, 2) NOT NULL,
  dominance NUMERIC(4, 2) NOT NULL,
  -- AI analysis
  analysis_text TEXT, -- Written analysis of the photo
  roast_line TEXT, -- Fun roast/commentary
  improvement_tips TEXT[], -- Array of improvement suggestions
  -- Quality signals
  lighting_quality NUMERIC(4, 2), -- 0-10
  background_quality NUMERIC(4, 2), -- 0-10
  expression_quality NUMERIC(4, 2), -- 0-10
  -- Context
  source TEXT DEFAULT 'upload' CHECK (source IN ('upload', 'generation', 'external')),
  generation_job_id UUID REFERENCES public.generation_jobs(id),
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_halo_scores_user ON public.halo_scores(user_id);
CREATE INDEX idx_halo_scores_overall ON public.halo_scores(overall_score);

-- ============================================
-- GENERATION JOBS
-- ============================================

CREATE TABLE public.generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  face_profile_id UUID NOT NULL REFERENCES public.face_profiles(id),
  -- Configuration
  preset_id TEXT NOT NULL, -- e.g., 'linkedin_executive', 'founder_energy', 'dating_magnetic'
  custom_prompt TEXT, -- User's additional instructions
  style_options JSONB DEFAULT '{}', -- {background, outfit, lighting, expression}
  num_images INTEGER DEFAULT 8,
  -- AI Processing
  replicate_prediction_id TEXT,
  model_version TEXT,
  -- Results
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'canceled')),
  generated_image_urls TEXT[] DEFAULT '{}',
  similarity_scores FLOAT[] DEFAULT '{}', -- Per-image face similarity score
  processing_time_ms INTEGER,
  error_message TEXT,
  -- Halo Score tracking
  halo_scores NUMERIC(5, 2)[] DEFAULT '{}', -- Per-image halo score
  before_halo_score NUMERIC(5, 2), -- User's halo score before generation
  best_after_halo_score NUMERIC(5, 2), -- Best halo score among generated images
  glow_up_delta NUMERIC(5, 2), -- best_after - before (the improvement)
  -- Cost tracking
  cost_usd NUMERIC(10, 6) DEFAULT 0,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_generation_jobs_user ON public.generation_jobs(user_id);
CREATE INDEX idx_generation_jobs_status ON public.generation_jobs(status);

-- ============================================
-- SAVED HEADSHOTS (user's favorites)
-- ============================================

CREATE TABLE public.saved_headshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  generation_job_id UUID REFERENCES public.generation_jobs(id),
  -- Image
  original_url TEXT NOT NULL,
  edited_url TEXT, -- If user made edits (background swap, etc.)
  thumbnail_url TEXT,
  -- Halo Score
  halo_score NUMERIC(5, 2),
  -- Voting / Help Me Pick
  vote_link_slug TEXT UNIQUE,
  vote_count_total INTEGER DEFAULT 0,
  vote_count_positive INTEGER DEFAULT 0,
  -- Metadata
  preset_id TEXT,
  resolution TEXT DEFAULT '1024x1024',
  is_favorite BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  -- Sharing
  public_share_slug TEXT UNIQUE,
  share_enabled BOOLEAN DEFAULT FALSE,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_headshots_user ON public.saved_headshots(user_id);

-- ============================================
-- PHOTO VOTES (Help Me Pick polls)
-- ============================================

CREATE TABLE public.photo_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Poll photos
  photo_a_url TEXT NOT NULL,
  photo_b_url TEXT NOT NULL,
  -- Vote tallies
  votes_a INTEGER DEFAULT 0,
  votes_b INTEGER DEFAULT 0,
  -- Sharing
  share_slug TEXT UNIQUE NOT NULL,
  -- Expiry
  expires_at TIMESTAMPTZ,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photo_votes_slug ON public.photo_votes(share_slug);
CREATE INDEX idx_photo_votes_user ON public.photo_votes(user_id);

-- ============================================
-- STYLE PRESETS
-- ============================================

CREATE TABLE public.style_presets (
  id TEXT PRIMARY KEY, -- e.g., 'linkedin_executive'
  -- Display
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('professional', 'creative', 'dating', 'social', 'corporate', 'industry')),
  icon_emoji TEXT,
  preview_images TEXT[] DEFAULT '{}',
  -- AI Config
  prompt_template TEXT NOT NULL, -- The actual prompt sent to the model
  negative_prompt TEXT,
  style_config JSONB DEFAULT '{}', -- {backgrounds: [...], outfits: [...], lighting: [...]}
  halo_pitch TEXT, -- Marketing pitch explaining how this preset improves your Halo Score
  -- Availability
  is_free BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NUDGE MESSAGES
-- ============================================

CREATE TABLE public.nudge_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Content
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('halo_decay', 'psychology_facts', 'social_proof', 'fomo', 'seasonal')),
  -- Targeting
  target_tier TEXT CHECK (target_tier IN ('free', 'pro', 'team', 'all')),
  target_days_since_generation INTEGER, -- Days since last generation to trigger
  -- Metrics
  sent_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nudge_messages_category ON public.nudge_messages(category);

-- ============================================
-- TEAMS (for Team plan)
-- ============================================

CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id),
  -- Branding
  logo_url TEXT,
  brand_colors JSONB DEFAULT '{}', -- {primary, secondary, accent}
  brand_guidelines TEXT,
  -- Settings
  default_preset_id TEXT REFERENCES public.style_presets(id),
  default_background TEXT,
  max_members INTEGER DEFAULT 50,
  -- Billing
  stripe_subscription_id TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invite_email TEXT,
  invite_status TEXT DEFAULT 'pending' CHECK (invite_status IN ('pending', 'accepted', 'declined')),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- ============================================
-- WAITLIST & LEADS (GTM)
-- ============================================

CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  use_case TEXT, -- What they want headshots for
  current_photo_url TEXT, -- Photo uploaded during waitlist signup
  halo_score NUMERIC(5, 2), -- Halo score computed for waitlist photo
  source TEXT, -- 'product_hunt', 'reddit', 'organic', 'ad_meta', 'ad_google', 'referral'
  referral_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'converted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FEEDBACK & NPS
-- ============================================

CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  -- Feedback
  type TEXT NOT NULL CHECK (type IN ('nps', 'bug', 'feature_request', 'quality_report', 'general')),
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  message TEXT,
  -- Context
  generation_job_id UUID REFERENCES public.generation_jobs(id),
  page_url TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFERRAL TRACKING
-- ============================================

CREATE TABLE public.referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id),
  referred_id UUID REFERENCES public.profiles(id),
  referred_email TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('click', 'signup', 'trial', 'conversion')),
  reward_granted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN: AB TESTS & FEATURE FLAGS
-- ============================================

CREATE TABLE public.feature_flags (
  id TEXT PRIMARY KEY,
  description TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ab_tests (
  id TEXT PRIMARY KEY,
  description TEXT,
  variants JSONB NOT NULL, -- [{name: 'control', weight: 50}, {name: 'variant_a', weight: 50}]
  target_metric TEXT, -- 'conversion_rate', 'nps_score', etc.
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYTICS: EVENT LOG
-- ============================================

CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  session_id TEXT,
  -- Event
  event_name TEXT NOT NULL, -- 'page_view', 'upload_started', 'generation_completed', 'halo_score_computed', etc.
  event_properties JSONB DEFAULT '{}',
  -- Context
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_country TEXT,
  ip_city TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_headshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.halo_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nudge_messages ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own face profiles" ON public.face_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own generation jobs" ON public.generation_jobs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own saved headshots" ON public.saved_headshots
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own halo scores" ON public.halo_scores
  FOR ALL USING (auth.uid() = user_id);

-- Photo votes: owners can manage, public can read by slug
CREATE POLICY "Users can manage own polls" ON public.photo_votes
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view polls by slug" ON public.photo_votes
  FOR SELECT USING (true);

-- Nudge messages: read-only for all authenticated users, write for admins (handled at app level)
CREATE POLICY "Authenticated users can read nudges" ON public.nudge_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Style presets are public read
CREATE POLICY "Anyone can read style presets" ON public.style_presets
  FOR SELECT USING (true);

-- Waitlist is insert-only for anon, read for authenticated
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);
