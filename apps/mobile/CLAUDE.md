# CLAUDE.md - Mobile App

This file provides guidance to Claude Code when working with the mobile app in this monorepo.

## Prerequisites

- Node.js v22.16.0
- pnpm >=10.11.1
- Expo CLI

## Development Commands

Run these commands from `apps/mobile/`:

- `pnpm build:check` — type-check mobile app
- `pnpm lint` — run ESLint with autofix
- `pnpm format .` — run Prettier autofix

## Project Structure

```txt
apps/mobile/
├── package.json                     # package-only scripts
├── src/
│   ├── app/                         # Expo Router screens, layouts, and stacks
│   ├── assets/translations/         # en.json & es.json (hierarchical, kebab-case keys)
│   ├── components/
│   │   ├── ui/                      # Basic reusable UI primitives
│   │   ├── form/                    # react-hook-form wrappers used across quizzes
│   │   ├── quiz/                    # Quiz-only UI layered on form components
│   │   ├── migri/                   # App-specific surfaces
│   │   └── trans/                   # Translated UI primitives (TransText, TransButton, etc.)
│   ├── lib/
│   │   ├── data/                    # MMKV-backed jotai atoms (one file per domain)
│   │   ├── mmkv.ts                  # Shared MMKV configuration
│   │   ├── quiz/                    # Quiz flow orchestration helpers
│   │   ├── services/
│   │   │   └── <service>/form/
│   │   │       ├── *_fields.ts      # Data-only field definitions per PDF section
│   │   │       ├── pdf.ts           # PDF assembly/orchestration
│   │   │       └── types.ts         # Shared types for the service
│   │   └── supabase/                # Remote integration helpers
│   └── hooks/                       # Custom React hooks
└── ...
```

## Architecture & Technology

### Core Stack

- **Framework:** React Native 0.81.4 with Expo SDK 54
- **Routing:** Expo Router (file-based routing in `src/app/`)
- **State Management:** Jotai + Zustand
- **Data Persistence:** MMKV-backed jotai atoms
- **Forms:** react-hook-form with Zod validation
- **Styling:** twrnc (Tailwind for React Native)
- **i18n:** react-i18next
- **PDFs:** @cantoo/pdf-lib
- **Data Fetching:** @tanstack/react-query with @supabase-cache-helpers

### Import Aliases

- `@/` resolves to `src/`
- Use workspace protocol for shared packages: `@repo/api`, `@repo/supabase`

### Navigation

- Expo Router uses file-based routing in `src/app/`
- Onboarding flow controlled by `isOnboardingCompleteAtom`
- Service-specific routes under `/services/[serviceId]/`

## Data Management

- Persist personal data exclusively through MMKV-backed jotai atoms defined in `@/lib/data`
- Use `atomWithMmkvStorage` with a Zod schema, typed defaults, and the shared MMKV instance from `@/lib/mmkv`
- Keep each data domain (e.g., `user`, `spouse`) in its own file for clarity and separation
- Never use async storage or other persistence mechanisms for user data

## Quiz Implementation

### Structure

- Follow the `QuizScreen` → `QuizPage` pattern
- UI components live in `@/components/quiz`
- Orchestration helpers stay in `@/lib/quiz`
- Quiz components should stay thin, delegating generic RHF work to form components

### Callbacks

- Use `onSuccess` for simple acceptance (always succeeds)
- Use `onSubmit` when you may reject data (return `true`/`false`)

### Translations

- Quiz pages always need titles and field translations
- Derive keys from the service → quiz → screen → page → field hierarchy
- Example: `services.i589.info.employment-history.jobs.employer-name.label`
- Keep keys consistent across similar quiz implementations

### Best Practices

- Review similar quiz files before adding new ones
- Never consume quiz components outside of quiz flows
- Maintain the dependency direction: `quiz` → `form` → `ui`

## PDF Services

### Structure

```txt
@/lib/services/<service>/form/
├── *-fields.ts     # Data-only definitions per PDF section
├── pdf.ts          # PDF assembly/orchestration
└── types.ts        # Shared TypeScript types
```

### Guidelines

- Keep field definitions modular and data-focused
- Consolidate PDF logic inside `pdf.ts`
- If a service produces multiple PDFs, organize them per file without unnecessary complexity
- Use Zod schemas for validation
- Follow existing patterns from similar services

## Localization

### Translation Files

- English: `src/assets/translations/en.json`
- Spanish: `src/assets/translations/es.json`
- Keep keys hierarchical and kebab-case (e.g., `form.address.street-number`)
- Always add keys for both English and Spanish

### Components

- Prefer translated primitives: `<TransText>`, `<TransButton>`, etc.
- Fall back to `useT()` hook only when needed (screen titles, placeholders, dynamic content)
- Never leave user-facing strings inline

### Translation Key Patterns

- Forms: `form.<component>.<field>`
- Services: `services.<service>.<section>.<subsection>`
- UI: `<feature>.<action>`
- Errors: `error.<type>.<specific>`

## Styling

### twrnc Usage

- Default to `` tw`...` `` template literals for static styling
- Use `tw.style()` when combining classes with conditional styles or theme values
- Only fall back to inline `style={{}}` for navigation props or unavoidable React Native APIs
- Mix approaches with arrays as needed: ``style={[tw`base-class`, dynamicStyle]}``

### Patterns

```tsx
// Static styles
<View style={tw`flex-1 p-4`} />

// Dynamic styles
<View style={tw.style(`p-4`, { backgroundColor: theme.colors.surface })} />

// Mixed
<View style={[tw`flex-1`, { marginTop: headerHeight }]} />
```

## UI Component Dependencies

### Dependency Direction

- `@/components/quiz` may depend on `@/components/form`
- `@/components/form` may depend on `@/components/ui`
- Keep this direction and avoid circular coupling
- Never import quiz components outside quiz flows

### Component Organization

- **ui/** — Basic primitives (buttons, inputs, dialogs, cards)
- **form/** — react-hook-form wrappers and field components
- **quiz/** — Quiz-specific UI that composes form components
- **trans/** — Translated versions of UI primitives
- **migri/** — App-specific features and surfaces

## Code Style

### TypeScript

- Strict mode enabled, all new code must be typed
- Provide accurate generics
- Validate with Zod where appropriate
- Avoid `any` types

### Naming Conventions

- **Files:** kebab-case (`contact-info.tsx`)
- **Components:** PascalCase (`ContactInfo`)
- **Utilities/functions:** camelCase (`getUserData`)
- **Hooks:** prefix with `use` (`useQuizState`)
- **Types/Interfaces:** PascalCase (`UserData`)

### Formatting

- Prettier enforces semicolons, single quotes, and sorted Tailwind classes
- Run `pnpm format` to autofix
- ESLint with strict TypeScript rules

### Comments

- Use sparingly—prefer self-documenting code and clear naming
- Add comments for complex logic or non-obvious decisions
- Document public APIs with JSDoc when helpful

## Environment Variables

- Expo public env vars must be prefixed with `EXPO_PUBLIC_*`
- Validated using `@t3-oss/env-core`
- Environment files are watched by Turborepo (see root `turbo.json`)

## Testing

⚠️ **Testing is not configured—do not add or run automated tests.**

Quality gates:

- `pnpm build:check` — TypeScript compilation
- `pnpm lint` — ESLint validation
- Husky pre-commit hooks

## Development Practices

### Consistency

- Mirror existing conventions across files and services
- Consistency matters more than personal preference
- Review adjacent implementations before introducing new features
- Maintain cohesion across the project

### Quality Gates

1. Run `pnpm build:check` before committing
2. Run `pnpm lint` to ensure no warnings
3. Format code with `pnpm format`
4. Test on both iOS and Android when making UI changes
5. Verify translations exist for all new user-facing strings

### Common Pitfalls to Avoid

- Don't use quiz components outside quiz flows
- Don't persist data outside of jotai + MMKV atoms
- Don't skip translations for user-facing strings
- Don't introduce circular dependencies between component layers
- Don't use inline styles when twrnc suffices
- Don't hardcode values that should come from data or config

### When Adding New Features

1. Check for similar existing implementations
2. Follow the established patterns and structure
3. Ensure proper typing throughout
4. Add translations for all user-facing strings
5. Test on both platforms
6. Update this documentation if introducing new patterns
