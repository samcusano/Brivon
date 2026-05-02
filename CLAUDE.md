# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev:client   # Vite dev server (port 5001)
npm run dev          # Express API server (port 3001)
npm run build        # Production build — Vite client + esbuild server bundle
npm run check        # TypeScript type-check (no emit)
npm run db:push      # Push Drizzle schema changes to Postgres
```

No test runner is configured.

## Environment Variables

```
ANTHROPIC_API_KEY   # Required for letter generation
DATABASE_URL        # Postgres connection string (falls back to MemStorage if absent)
RESEND_API_KEY      # Optional — emails log to console when absent
APP_URL             # Base URL for patient-facing links (default: http://localhost:3001)
ADVOCATE_EMAIL      # Recipient for new-case notifications
```

## Architecture

**Monorepo layout:** `client/` (React/Vite), `server/` (Express), `shared/` (Drizzle schema + Zod types). Path aliases: `@` → `client/src`, `@shared` → `shared/`.

**Case lifecycle — the core data flow:**

1. Patient submits the 3-step `AppealIntake` form → `POST /api/appeals` creates a `draft` case.
2. Frontend immediately calls `POST /api/appeals/:id/generate` → server invokes the Claude API (`claude-opus-4-5`) with a structured medical prompt → status transitions `draft → generating → ready`.
3. Advocate opens `AdvocatePortal`, reviews the AI-generated letter in `AdvocateCaseDetail`, edits via `PATCH /api/appeals/:id`, and approves via `POST /api/appeals/:id/approve`.
4. Outcome recorded via `POST /api/appeals/:id/outcome` (`won` | `lost`).

**Storage abstraction:** `server/storage.ts` defines an `IStorage` interface. The active implementation is `MemStorage` (in-memory Maps). Swap to the Drizzle/Postgres implementation by wiring it in `server/routes.ts` and setting `DATABASE_URL`.

**Shared schema:** `/shared/schema.ts` defines Drizzle tables and exports Zod schemas (`insertAppealCaseSchema`, `AppealCase` type) consumed by both server routes and client types.

**Frontend data fetching:** All API calls go through `apiRequest()` in `client/src/lib/queryClient.ts`. React Query is configured with `staleTime: Infinity` and `retry: false` — mutations explicitly invalidate query keys after success.

**Routing:** Wouter (not React Router). Routes defined in `client/src/App.tsx`: `/` (AppealIntake), `/case/:id` (PatientCase), `/advocate` (AdvocatePortal), `/__design_lab` (design iteration sandbox — not for production).

**AI prompt:** `buildAppealPrompt()` in `server/routes.ts` constructs the Claude prompt. It includes patient info, insurer, denied service with CPT/ICD-10 codes, denial reason, clinical context, and optionally extracted PDF text from the uploaded denial letter. Target output: 400–600 word professional appeal letter citing clinical guidelines.

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite`. Design tokens use warm earth tones — primary `hsl(14 55% 38%)`, cream gradient background, Source Serif 4 for headings, Inter for body. UI components are shadcn/ui (Radix primitives, New York style). Charts use Recharts, animations use Framer Motion.
