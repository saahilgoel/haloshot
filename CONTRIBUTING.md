# Contributing to HaloShot

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in credentials
3. `npm install`
4. `npm run dev`

## Branch Strategy

- `main` = production (auto-deploys to Vercel)
- Create feature branches for non-trivial changes
- PRs to `main` for review

## Code Style

- TypeScript strict mode
- Tailwind for all styling (no CSS modules, no styled-components)
- shadcn/ui for component primitives
- `cn()` helper for conditional classes
- Prefer server components where possible; use `"use client"` only when needed (hooks, interactivity)

## Adding a New Admin Page

1. Create `app/admin/your-page/page.tsx` (use `"use client"`)
2. Add nav item in `app/admin/layout.tsx` (navItems array)
3. If it needs data, create `/api/admin/your-endpoint/route.ts`
4. Fetch on mount with `useEffect`, show loading state, add Refresh button
5. **Never use hardcoded/fake data** — always query Supabase

## Adding a New Marketing Page

1. Create `app/(marketing)/your-page/page.tsx`
2. Create `app/(marketing)/your-page/layout.tsx` with metadata (title, description, OG, canonical)
3. Add to `public/sitemap.xml`
4. Page is automatically public (middleware denylist pattern)

## Adding a New API Route

1. Create `app/api/your-route/route.ts`
2. API routes are public by default (middleware allows `/api/*`)
3. For protected routes, check auth with `supabase.auth.getUser()`
4. For admin routes, check `ADMIN_EMAILS` env var

## Adding a New Generation Model

1. Add model config to `/api/admin/playground/route.ts` (MODELS object)
2. Add model option to `/api/generate/route.ts` if it should be a production option
3. Add cost estimate to webhook (`app/api/generate/webhook/route.ts`, costPerImage map)
4. Test in admin playground first before making it a production option

## Database Changes

- Add migrations in `supabase/migrations/`
- Update types if using TypeScript Supabase types
- Run `npm run seed` to re-seed presets after schema changes

## Testing

- `npm run build` — catches TypeScript errors
- `npm run lint` — ESLint
- Manual testing flows: score a photo, generate headshots, check admin dashboard
