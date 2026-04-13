# CLAUDE.md — Instructions for AI Assistants

## What is this project?

HaloShot (haloshot.com) — an AI headshot generator differentiated by its "Halo Score," a psychology-backed photo scoring system based on the halo effect. Users upload a photo, get scored on warmth/competence/trustworthiness, then generate optimized headshots.

## Key Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run seed         # Seed style presets to Supabase
```

## Architecture Rules

- **Next.js 14 App Router** with route groups: `(marketing)` = public, `(app)` = authenticated, `admin` = admin-only
- **Middleware** (`middleware.ts`) uses a denylist of protected routes. Everything NOT in the list is public. Do not switch back to an allowlist pattern — it broke all marketing pages before.
- **Supabase** for auth, DB, and storage. Use `createClient()` from `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (RSC/API), or `lib/supabase/admin.ts` (service role, bypasses RLS).
- **Replicate** for image generation via HTTP API (not the SDK). Webhook at `/api/generate/webhook`.
- **Anthropic Claude** for Halo Score analysis via Vercel AI SDK.
- **Vercel** for hosting. Auto-deploys from `main`. Domain: haloshot.com.

## Style & UI

- Dark theme only. Colors: violet-500 (#6C3CE0) primary, halo-500 (amber/gold) accent, lime-400 for positive states.
- Use shadcn/ui components. Don't create custom UI primitives.
- Use `cn()` from `lib/utils` for conditional classNames.
- Use Framer Motion for animations on marketing pages.
- Keep the provocative, honest copy tone ("It might sting", "No sugarcoating").

## Code Patterns

- All pages under `(marketing)/` are `"use client"` with Framer Motion. Metadata lives in sibling `layout.tsx` files.
- Admin pages fetch data from `/api/admin/*` routes. No fake/sample data — all real Supabase queries.
- Generation flow: `/api/generate` fires parallel Replicate predictions → webhook receives results → stores to R2 + Supabase → auto-scores via Claude.
- Cost tracking: webhook estimates cost_usd per image based on model (nano-banana-2=$0.003, etc.).

## Database

Schema in `supabase/migrations/001_initial_schema.sql`. Key tables: `profiles`, `generation_jobs`, `saved_headshots`, `halo_scores`, `style_presets`, `feedback`, `face_profiles`, `analytics_events`.

## Don't

- Don't add fake/sample data to admin pages — wire to real Supabase queries
- Don't gate marketing pages behind auth — the middleware denylist pattern is intentional
- Don't change the webhook URL without updating Replicate predictions
- Don't use `ADMIN_EMAILS` from a constants file — read from `process.env.ADMIN_EMAILS` directly
- Don't add emojis unless the user asks
