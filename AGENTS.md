# Repository Guidelines

## Project Structure & Module Organization

This monorepo runs on pnpm 10 with Turborepo. `apps/platform` houses the Next.js 15 web app—routes live in `src/app`, shared UI in `src/components/ui`, and data helpers under `src/lib` and `src/queries`. `apps/mobile` is the Expo Router client with screens in `src/app`, state in `src/atoms`, and reusable hooks in `src/hooks`. Shared logic belongs in `packages/api` (tRPC procedures, Supabase adapters) and `packages/supabase` (SQL migrations, generated types, helper scripts). Common linting, formatting, and TypeScript configs live under `tooling/*`.

## Build, Test, and Development Commands

- `pnpm lint` or `pnpm lint:check` — run workspace ESLint with or without autofix.
- `pnpm format` — run Prettier autofix across the repo.
- `pnpm build:check` — execute each package’s type-check pipeline (Next lint + `tsc`, Expo `tsc`, library checks).

## Coding Style & Naming Conventions

All code is TypeScript-first. Prettier (via `@repo/prettier-config`) enforces semicolons, single quotes, and Tailwind class sorting; run `pnpm format` or `format:check` from the root. ESLint extends the shared strict TypeScript config, so fix warnings before merging. Prefer PascalCase component exports, camelCase utilities, kebab-case file names, and prefix hooks with `use`. Import shared modules via the `@/` alias instead of relative dot paths.

## Testing Guidelines

Automated tests are minimal today, so rely on `pnpm build:check` and `lint:check` before every PR. Database changes must be accompanied by a passing `pnpm --filter @repo/supabase run db:test`. When adding new suites, colocate `*.test.ts(x)` beside the code, keep them deterministic, and wire a Turbo task so `pnpm turbo run test` can scale across apps.

## Commit & Pull Request Guidelines

Follow Conventional Commits (`feat:`, `fix:`, `chore:`) to satisfy commitlint and keep history searchable. Scope changes narrowly, update Supabase types with `pnpm --filter @repo/supabase run types:write` after schema edits, and ensure screenshots or recordings accompany UI-facing PRs. Keep PR descriptions concise, list affected packages, and link tracking issues when available.

## Supabase & Configuration Tips

Local Supabase lives inside `packages/supabase`; SQL migrations belong in `migrations/` and seed data in `seed.sql`. Use `db:diff` to inspect pending changes and `migrations:push` or `config:push` to sync remote projects. Regenerate `gen/database.types.ts` with `types:write` after every schema change.
