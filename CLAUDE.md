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

### Package-specific Commands

For package-specific commands, see the CLAUDE.md file in each package directory:

- Mobile app: `apps/mobile/CLAUDE.md`
- Web platform: `apps/platform/` (no specific CLAUDE.md yet)
- Supabase: `packages/supabase/` (no specific CLAUDE.md yet)

## Monorepo Structure

**Apps:**

- `apps/mobile` — React Native (Expo Router) mobile application
- `apps/platform` — Next.js 15 web application

**Packages:**

- `packages/api` — tRPC router and API procedures
- `packages/supabase` — Database layer and Supabase tooling

**Tooling:**

- `tooling/*` — Shared ESLint, Prettier, and TypeScript configurations

## Technology Stack

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

## Important Patterns

### Import Aliases

- Use `@/` alias for imports within each app (resolves to `src/`)
- Use workspace protocol for package imports: `@repo/api`, `@repo/supabase`

### Database Workflow

1. Make schema changes in `packages/supabase/migrations/`
2. Run `pnpm --filter @repo/supabase db:reset` to apply locally
3. MUST run `pnpm --filter @repo/supabase types:write` to regenerate TypeScript types
4. MUST run `pnpm --filter @repo/supabase db:test` to ensure tests pass
5. Use `db:diff` to verify changes before pushing
6. Push to remote with `migrations:push` or `config:push`

### tRPC Usage

- Define procedures in `packages/api/src/index.ts`
- Mobile and web apps import the router and get full type safety
- Use react-query integration via `@trpc/tanstack-react-query`

### Shared Dependencies

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

## Testing Guidelines

Automated tests are minimal today, so rely on `pnpm build:check` and `lint:check` before every PR. Database changes must be accompanied by a passing `pnpm --filter @repo/supabase db:test`. When adding new suites, colocate `*.test.ts(x)` beside the code, keep them deterministic, and wire a Turbo task so `pnpm turbo run test` can scale across apps.

## Commit & Pull Request Guidelines

Follow Conventional Commits (`feat:`, `fix:`, `chore:`) to satisfy commitlint and keep history searchable. Scope changes narrowly, update Supabase types with `pnpm --filter @repo/supabase types:write` after schema edits, and ensure screenshots or recordings accompany UI-facing PRs. Keep PR descriptions concise, list affected packages, and link tracking issues when available.
