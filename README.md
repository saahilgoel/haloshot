# HaloShot

**AI headshots powered by the halo effect.**

HaloShot scores your photo for warmth, competence, and trustworthiness — the three dimensions that drive first impressions — then generates AI headshots optimized for the perception you want to project.

**Live:** [haloshot.com](https://haloshot.com)
**Admin:** [haloshot.com/admin](https://haloshot.com/admin) (requires `ADMIN_EMAILS`)

---

## Architecture

```
User uploads photo
    │
    ▼
┌─────────────────────────────────────────┐
│  Next.js 14 (App Router)                │
│  ├─ (marketing)/ — public pages         │
│  ├─ (app)/ — authenticated app          │
│  ├─ admin/ — admin dashboard            │
│  └─ api/ — API routes                   │
└────────────┬────────────────────────────┘
             │
     ┌───────┼───────┬──────────┐
     ▼       ▼       ▼          ▼
  Supabase  Replicate  Anthropic  Cloudflare R2
  (DB+Auth) (Image Gen) (Halo Score) (Storage)
```

### Core Flow

1. **Score** (`/api/score`) — Claude analyzes a photo for warmth, competence, trustworthiness (0-100 each)
2. **Generate** (`/api/generate`) — Replicate generates headshots from a reference photo + style preset
3. **Webhook** (`/api/generate/webhook`) — Replicate calls back with results, we store to R2/Supabase, auto-score
4. **Gallery** (`/gallery`) — User views, favorites, edits, shares their headshots

### Models

| Model | Provider | Use | Est. Cost/Image |
|-------|----------|-----|-----------------|
| Nano Banana 2 | Replicate | Primary generation (best quality) | ~$0.003 |
| Nano Banana | Replicate | Fast/cheaper generation | ~$0.0015 |
| Flux Kontext Pro | Replicate | Fallback + edits | ~$0.005 |
| Claude Sonnet | Anthropic | Halo Score analysis | ~$0.01/score |
| InsightFace | Replicate | Face similarity verification | ~$0.001 |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| UI | Tailwind CSS + shadcn/ui + Framer Motion |
| Auth + DB | Supabase (Postgres, RLS, Auth, Storage) |
| Image Gen | Replicate API (HTTP, webhooks) |
| AI Scoring | Anthropic Claude (vision) via Vercel AI SDK |
| Storage | Cloudflare R2 (generated images) + Supabase Storage |
| Payments | Stripe (subscriptions) |
| Email | Resend |
| Analytics | PostHog + Supabase `analytics_events` |
| Rate Limiting | Upstash Redis |
| Monitoring | Sentry |
| Hosting | Vercel (auto-deploy from `main`) |
| Charts | Recharts (admin dashboards) |

---

## Project Structure

```
app/
├── (marketing)/          # Public pages (no auth required)
│   ├── page.tsx          # Homepage with inline score widget
│   ├── score/            # Free Halo Score page
│   ├── pricing/          # Pricing page
│   ├── science/          # Halo effect research
│   ├── examples/         # Before/after gallery
│   ├── blog/             # Blog index + [slug] posts
│   ├── for/              # Use-case landing pages
│   │   ├── linkedin/
│   │   ├── dating/
│   │   ├── founders/
│   │   ├── real-estate/
│   │   └── teams/
│   ├── compare/          # Competitor comparisons
│   │   └── [competitor]/
│   └── contact/
├── (app)/                # Authenticated app pages
│   ├── dashboard/        # User dashboard
│   ├── generate/         # Headshot generation
│   ├── gallery/          # Saved headshots
│   ├── editor/[id]/      # Photo editor
│   ├── score/[id]/       # Score report
│   ├── settings/         # User settings + billing
│   ├── refer/            # Referral program
│   └── team/             # Team management
├── admin/                # Admin dashboard (requires ADMIN_EMAILS)
│   ├── page.tsx          # Overview stats
│   ├── users/            # User management
│   ├── generations/      # Generation analytics + cost tracking
│   ├── logs/             # Event + generation logs
│   ├── playground/       # Model comparison tool
│   ├── presets/          # Style preset management
│   ├── analytics/        # Usage analytics
│   ├── billing/          # Revenue metrics
│   ├── feedback/         # User feedback + NPS
│   ├── flags/            # Feature flags (env-based)
│   └── content/          # Blog + SEO page management
├── api/
│   ├── score/            # Halo Score analysis
│   ├── generate/         # Image generation + webhook
│   ├── edit/             # Image editing (Flux Kontext)
│   ├── face-profile/     # Face profile management
│   └── admin/            # Admin API routes
│       ├── stats/
│       ├── generations/
│       ├── logs/
│       ├── presets/
│       └── playground/
lib/
├── ai/
│   ├── halo-score.ts     # Claude-based photo scoring
│   ├── prompts.ts        # Style presets + prompt templates
│   └── quality-gate.ts   # Similarity filtering
├── replicate/
│   ├── client.ts         # Replicate API client
│   ├── models.ts         # Model definitions
│   └── face-similarity.ts # InsightFace embeddings
├── supabase/
│   ├── client.ts         # Browser client
│   ├── server.ts         # Server client (RSC)
│   ├── admin.ts          # Service role client (bypasses RLS)
│   └── middleware.ts      # Session refresh
├── hooks/
│   ├── useHaloScore.ts   # Score analysis hook
│   ├── useUser.ts        # Auth user hook
│   └── useGeneration.ts  # Generation polling hook
├── analytics/
│   └── track.ts          # PostHog + Supabase event tracking
├── stripe/               # Stripe integration
├── email/                # Resend email templates
└── storage/              # R2 upload utilities
components/
├── marketing/            # Landing page components
├── app/                  # App UI components
├── admin/                # Admin dashboard components
├── halo/                 # Halo Score display components
├── shared/               # Footer, loading states
└── ui/                   # shadcn/ui primitives
```

---

## Database Schema

Key tables (full schema in `supabase/migrations/001_initial_schema.sql`):

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles, subscription tier, generation counts, halo score |
| `face_profiles` | Reference photos + face embeddings (pgvector) |
| `generation_jobs` | Generation requests: model, status, cost, similarity scores |
| `saved_headshots` | Gallery: generated images with halo scores |
| `halo_scores` | Detailed score breakdowns (warmth, competence, trust, etc.) |
| `style_presets` | Configurable generation presets with prompt templates |
| `feedback` | User feedback: NPS, bugs, feature requests |
| `analytics_events` | Event logging (page views, actions, errors) |
| `photo_votes` | "Help Me Pick" voting polls |

---

## Auth & Routing

**Middleware** (`middleware.ts`) uses a protected-routes denylist:

- **Protected** (require login): `/dashboard`, `/generate`, `/gallery`, `/editor`, `/settings`, `/refer`, `/team`, `/pick/new`, `/admin`
- **Public** (no auth): Everything else — homepage, `/score`, `/pricing`, `/science`, `/blog`, `/for/*`, `/compare/*`, `/examples`, `/contact`
- **Admin**: Protected routes additionally check `ADMIN_EMAILS` env var

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase admin access |
| `REPLICATE_API_TOKEN` | Yes | Image generation |
| `ANTHROPIC_API_KEY` | Yes | Halo Score analysis |
| `FAL_KEY` | No | Backup image gen (fal.ai) |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Yes | Image storage |
| `R2_BUCKET_NAME` / `R2_PUBLIC_URL` | Yes | Image storage |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | For billing | Payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For billing | Client-side Stripe |
| `STRIPE_PRO_MONTHLY_PRICE_ID` / `STRIPE_PRO_ANNUAL_PRICE_ID` | For billing | Price IDs |
| `RESEND_API_KEY` | No | Transactional emails |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | No | Analytics |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | No | Rate limiting |
| `ADMIN_EMAILS` | Yes | Comma-separated admin emails |

---

## Development

```bash
# Install
npm install

# Run dev server
npm run dev

# Build
npm run build

# Seed style presets
npm run seed

# Seed nudge messages
npm run seed:nudges
```

---

## Deployment

Hosted on **Vercel**. Auto-deploys from `main` branch.

```bash
# Push to deploy
git push origin main

# Set env vars
vercel env add VARIABLE_NAME production

# Manual deploy
vercel --prod
```

The webhook URL is hardcoded to `https://haloshot.com/api/generate/webhook` — update this if the domain changes.

---

## Pricing Tiers

| Tier | Price | Headshots | Halo Scores | Features |
|------|-------|-----------|-------------|----------|
| Free | $0 | 3 | 1 | 1024px, 1 preset, watermarked |
| Quick Fix | $14.99 one-time | 50 | 5 | 2048px, all presets, commercial license |
| Glow-Up | $9.99/mo | 100/mo | Unlimited | 2048px, all presets, bg removal |
| Team | $7.99/person/mo | Unlimited | Unlimited | Custom brand styles, admin dashboard, API |

---

## Halo Score Dimensions

Based on Thorndike (1920), Willis & Todorov (2006), and Fiske et al. (2002):

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Warmth | 25% | Friendly, likable, approachable |
| Competence | 25% | Professional, intelligent, capable |
| Trustworthiness | 25% | Reliable, genuine, symmetrical |
| Approachability | 15% | Comfortable, inviting |
| Dominance | 10% | Authority, confidence, presence |

Overall score = weighted average, clamped to 0-100.
