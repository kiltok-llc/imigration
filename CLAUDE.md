# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing an immigration services platform with a Next.js web app and React Native (Expo) mobile app. The project uses pnpm 10 with Turborepo for task orchestration, Supabase for the backend, and tRPC for type-safe API communication.

## Development Commands

### Root-level Commands

- `pnpm install` — install all dependencies across the monorepo
- `pnpm dev` — start all apps in development mode (via Turbo)
- `pnpm lint` — run ESLint with autofix across all workspaces
- `pnpm lint:check` — run ESLint without autofix
- `pnpm format` — format code with Prettier across the repo
- `pnpm format:check` — check formatting without writing
- `pnpm build:check` — type-check all packages (Next lint + tsc for each workspace)
- `pnpm clean` — clean all build artifacts and node_modules

### Mobile App (`apps/mobile`)

- `pnpm --filter @repo/mobile dev` — start Expo development server
- `pnpm --filter @repo/mobile dev:ios` — start Expo on iOS simulator
- `pnpm --filter @repo/mobile dev:android` — start Expo on Android emulator
- `pnpm --filter @repo/mobile build:check` — type-check mobile app
- `pnpm --filter @repo/mobile ios` — run iOS app natively
- `pnpm --filter @repo/mobile android` — run Android app natively

### Web Platform (`apps/platform`)

- `pnpm --filter @repo/platform dev` — start Next.js dev server with Turbopack
- `pnpm --filter @repo/platform build` — build Next.js production bundle
- `pnpm --filter @repo/platform build:check` — run Next lint and type-check

### Supabase (`packages/supabase`)

- `pnpm --filter @repo/supabase dev` — start local Supabase instance
- `pnpm --filter @repo/supabase db:reset` — reset local database
- `pnpm --filter @repo/supabase db:test` — run database tests
- `pnpm --filter @repo/supabase db:diff` — show schema differences
- `pnpm --filter @repo/supabase types:write` — regenerate TypeScript types from database schema (MUST run after schema changes)
- `pnpm --filter @repo/supabase migrations:push` — push migrations to remote
- `pnpm --filter @repo/supabase config:push` — push config to remote

## Architecture

### Monorepo Structure

**Apps:**

- `apps/mobile` — React Native (Expo Router) mobile application
  - Routes: `src/app/` using Expo Router file-based routing
  - State: `src/atoms/` using Jotai for state management
  - Components: `src/components/` with reusable UI components
  - Hooks: `src/hooks/` for custom React hooks
  - i18n: `src/i18n.ts` using react-i18next for internationalization
  - Styling: Tailwind via `twrnc` library

- `apps/platform` — Next.js 15 web application
  - Routes: `src/app/` using Next.js App Router
  - Components: `src/components/ui/` for shared UI components
  - Server Actions: `src/actions/` for Next.js server actions
  - Data fetching: `src/queries/` for data access patterns
  - Lib utilities: `src/lib/` for shared utilities
  - Styling: Tailwind CSS v4

**Packages:**

- `packages/api` — tRPC router and API procedures
  - Exports type-safe API router with `appRouter` from `src/index.ts`
  - tRPC context and configuration in `src/trpc.ts`
  - Currently minimal, but intended for shared backend logic

- `packages/supabase` — Database layer and Supabase tooling
  - SQL migrations: `migrations/` directory
  - Seed data: `seed.sql`
  - Generated TypeScript types: `gen/database.types.ts` (auto-generated, don't edit manually)
  - Helper utilities: `src/` directory
  - Supabase config: `config.toml`
  - Scripts: `scripts/` for database management utilities

**Tooling:**

- `tooling/*` — Shared ESLint, Prettier, and TypeScript configurations

### Technology Stack

- **Package Manager:** pnpm with workspace protocol for internal packages
- **Build System:** Turborepo for task caching and orchestration
- **Mobile:** React Native 0.81.4, Expo SDK 54, Expo Router
- **Web:** Next.js 15.3.3 with React 19 and App Router
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **API Layer:** tRPC v11 for type-safe client-server communication
- **State Management:**
  - Mobile: Jotai + Zustand
  - Web: React Query + Server Components
- **Data Fetching:** @tanstack/react-query with @supabase-cache-helpers
- **Styling:**
  - Mobile: twrnc (Tailwind for React Native)
  - Web: Tailwind CSS v4
- **Forms:** react-hook-form with Zod validation
- **Testing:** Database tests via `supabase db test`
- **i18n:** react-i18next (mobile), Next.js i18n (web)

### Important Patterns

**Import Aliases:**

- Use `@/` alias for imports within each app (resolves to `src/`)
- Use workspace protocol for package imports: `@repo/api`, `@repo/supabase`

**Database Workflow:**

1. Make schema changes in `packages/supabase/migrations/`
2. Run `pnpm --filter @repo/supabase db:reset` to apply locally
3. MUST run `pnpm --filter @repo/supabase types:write` to regenerate TypeScript types
4. MUST run `pnpm --filter @repo/supabase db:test` to ensure tests pass
5. Use `db:diff` to verify changes before pushing
6. Push to remote with `migrations:push` or `config:push`

**tRPC Usage:**

- Define procedures in `packages/api/src/index.ts`
- Mobile and web apps import the router and get full type safety
- Use react-query integration via `@trpc/tanstack-react-query`

**Mobile Navigation:**

- Expo Router uses file-based routing in `apps/mobile/src/app/`
- Onboarding flow controlled by `isOnboardingCompleteAtom`
- Service-specific routes under `/services/[serviceId]/`

**Shared Dependencies:**

- Both apps share `@repo/supabase` for database types and utilities
- Both apps share `@repo/api` for tRPC procedures
- Superjson is used for data serialization across tRPC

## Code Style

- **TypeScript:** Strict mode enabled, all new code must be typed
- **Formatting:** Prettier with single quotes, semicolons, sorted Tailwind classes
- **Linting:** ESLint with strict TypeScript rules
- **Naming:**
  - Components: PascalCase
  - Utilities/functions: camelCase
  - Files: kebab-case
  - Hooks: prefix with `use`
- **Commits:** Follow Conventional Commits (feat:, fix:, chore:) for commitlint

## Environment Variables

Environment variables are validated using `@t3-oss/env-core` (mobile) and `@t3-oss/env-nextjs` (web).

- Mobile: Expo public env vars prefixed with `EXPO_PUBLIC_*`
- Web: Next.js public env vars follow Next.js conventions
- Global env vars: `.env*` files are watched by Turborepo (see turbo.json globalDependencies)

## Dependencies

- **Node:** v22.16.0 (see engines in package.json)
- **pnpm:** >=10.11.1 (specified as packageManager)
- **React:** v19.1.0 (using react19 catalog)
- **Patches:** Some dependencies are patched (see `patches/` and `pnpm-workspace.yaml` patchedDependencies)
