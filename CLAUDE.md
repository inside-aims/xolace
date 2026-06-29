# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Next.js + Turbopack)
pnpm build        # Production build
pnpm type-check   # TypeScript type checking (tsc -b)
pnpm lint:fix     # ESLint auto-fix
pnpm format       # Prettier format all files
```

### Supabase local development

```bash
pnpm supabase:start           # Start local Supabase stack
pnpm supabase:stop            # Stop local stack
pnpm supabase:reset           # Reset DB and re-run migrations + seed
pnpm supabase:generate-types  # Regenerate types/types_db.ts from local schema
pnpm supabase:generate-migration  # Diff local DB and create a new migration file
pnpm supabase:push            # Push migrations to linked remote project
```

There are no automated tests in this repo.

## Architecture Overview

Xolace is a **Next.js 15 App Router** application (React 19, Turbopack) backed by **Supabase** (PostgreSQL + Auth + Realtime). The package manager is `pnpm`.

### Route Groups

| Group | Path | Purpose |
|---|---|---|
| `(protected)` | `/feed`, `/post`, `/campfires`, `/profile`, etc. | Authenticated app shell |
| `(auth-pages)` | `/sign-in`, `/sign-up`, `/forgot-password`, etc. | Auth flows |
| `(open)` | `/about`, `/policies`, `/professionals` | Public pages |
| `(mod-pages)` | `/c/[slug]/mod/*` | Campfire moderator tools |

The `(protected)` layout (`app/(protected)/layout.tsx`) fetches the user profile server-side via Supabase and renders a `SidebarLeft` + `Bottombar` shell. It initializes the Zustand user store via `<InitUser>`.

API routes live under `app/api/v1/` (auth callbacks, AI chatbot, transcription, campfire firekeeper invites).

### Auth & Middleware

- **Middleware** (`utils/supabase/middleware.ts` → `updateSession`): refreshes the Supabase session on every request via `supabase.auth.getClaims()`. Unauthenticated requests to protected routes redirect to `/sign-in?nexturl=<path>`. Authenticated requests to `/`, `/sign-in`, or `/sign-up` redirect to `/feed`.
- The cookie domain is hard-coded to `.xolace.app`. Local dev uses the default Supabase localhost behaviour.

### Supabase Clients

- **Server** (`utils/supabase/server.ts`): `createClient()` — use in Server Components, Server Actions, and Route Handlers.
- **Browser** (`utils/supabase/client.ts`): `getSupabaseBrowserClient()` — use in Client Components.
- **Admin** (`utils/supabase/adminClient.ts`): bypasses RLS; use only in trusted server contexts.

### State Management

Global client state is managed with **Zustand**:

- `lib/store/user.ts` — `useUserState`: current user profile + roles. Populated server-side and hydrated to the client by `<InitUser>`.
- `lib/store/preferences-store.ts` — `usePreferencesStore`: user preferences (theme, privacy, content filters, etc.) fetched from the `user_preferences` table.
- `lib/store/activity-store.ts` — activity feed state.

### Data Fetching

**TanStack Query** (`@tanstack/react-query`) is the standard for client-side data fetching. The `QueryClient` is set up in `app/providers.tsx` with a default `staleTime` of 60 seconds. Feed-specific cache timings are centralised in `lib/feedConfig.ts` (`FEED_CONFIG`).

Server Components call Supabase directly. Server Actions in `lib/actions/` are `"use server"` functions used from forms and mutations.

### Types

- `types/types_db.d.ts` — auto-generated from Supabase schema (run `pnpm supabase:generate-types` after schema changes).
- `types/global.d.ts` — domain types (`Post`, `DetailPost`, `Profile`, `Comment`, `EnhancedPost`, etc.) composed from the generated DB types.
- `types/post.ts`, `types/campfire.ts`, `types/activity.ts`, `types/highlightedContent.ts` — feature-specific types.

### Key Utilities

- `lib/utils.ts` — `cn()` (clsx + tailwind-merge), post helpers, BunnyCDN fetch wrapper (`apiFetch`), slug generators.
- `lib/activity-logger.ts` — `logActivity()`: server-side logger that inserts to `activity_logs` and calls `updateReputation()`.
- `lib/auth/middleware.ts` — `validatedAction()`: HOF that wraps a Server Action with Zod schema parsing.
- `lib/validation/` — Zod schemas for forms.

### User Roles

The platform has five roles stored in the `user_roles` table and surfaced on `EnhancedPost.author_roles`:

`normal_user` | `verified` | `blue_team` (moderators) | `help_professional` | `mentor`

### AI Integration

- **Chatbot** (`app/api/v1/chatbot-ai/route.ts`): streams from NVIDIA NIM API using the `google/gemma-2-9b-it` model. Requires `NVIDIA_NIM_API_KEY`.
- **Voice transcription** (`app/api/v1/transcribe/`, `/v2/lemur-request/`): AssemblyAI integration.
- AI SDK: `@ai-sdk/openai`, `@ai-sdk/react`, `ai` (Vercel AI SDK).

### Video / Media

BunnyCDN is used for video storage and streaming (`BUNNY_STREAM_ACCESS_KEY`, `BUNNY_STORAGE_ACCESS_KEY`). The `apiFetch` helper in `lib/utils.ts` handles BunnyCDN API auth. Video features live in `components/health-space/reflection/` and hooks in `hooks/videos/`.

### Campfires

Campfires are community spaces with their own moderation (`blue_team` role scoped to a campfire). Key files: `components/campfires/`, `hooks/campfires/`, `app/(protected)/x/[campfire]/`, `app/(mod-pages)/c/[slug]/mod/`.

### Feed Architecture

The main feed (`app/(protected)/feed/`) uses `FEED_CONFIG` from `lib/feedConfig.ts` to control pagination (50 posts/page), infinite scroll, and injection of featured campfire cards (every 10 posts, max 3) and highlighted content cards (at positions 5, 15, 25). Feed item types: `'post' | 'featured' | 'highlighted_content'`.

### Component Organisation

```
components/
  ui/           # Radix UI primitives (shadcn-style)
  shared/       # Layout wrappers, dialogs, loaders, shared patterns
  post-form/    # Post creation UI (features/, overlays/, ui/)
  campfires/    # Campfire-specific components
  health-space/ # Reflection/video content
  notifications/
  hocs/         # Page-level component groups (exploreComponents, detailsPostComponents, etc.)
  landing-sections/  # Public landing page sections
  magicui/      # Animation components
```

### Environment Variables

Required variables (copy `.env.local.example` → `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- `NVIDIA_NIM_API_KEY`
- `BUNNY_STREAM_ACCESS_KEY`, `BUNNY_STORAGE_ACCESS_KEY`
