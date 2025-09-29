# Development Guidelines

These notes consolidate the working agreements for the Expo Router mobile app and ensure the `.junie/guidelines.md` expectations are always reflected here.

## Prerequisites

- Node.js
- pnpm
- Expo CLI

## Setup & Core Commands

`pnpm install` # Install dependencies
`pnpm run build:check` # TypeScript compilation check
`pnpm run lint` # Run ESLint with autofix
`pnpm format .` # Run Prettier autofix

## Project Layout

```txt
apps/mobile/
├── package.json                     # package-only scripts (run inside apps/mobile)
├── src/
│   ├── app/                         # Expo Router screens, layouts, and stacks
│   ├── assets/translations/         # en.json & es.json (keep keys hierarchical, kebab-case)
│   ├── components/
│   │   ├── ui/                      # Basic reusable UI primitives
│   │   ├── form/                    # react-hook-form wrappers used across quizzes
│   │   ├── quiz/                    # Quiz-only UI layered on form components
│   │   └── migri/                   # App-specific surfaces
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
│   └── components/trans/            # Translated UI primitives (TransText, TransButton, etc.)
└── ...                              # Monorepo tooling/config lives at the repo root
```

## Testing

⚠️ Testing is not configured—do not add or run automated tests. Rely on `pnpm run build:check` and `pnpm run lint`.

## Data Management

- Persist personal data exclusively through MMKV-backed jotai atoms defined in individual files under `@/lib/data`.
- Use `atomWithMmkvStorage` with a Zod schema, typed defaults, and the shared MMKV instance from `@/lib/mmkv`.
- Keep each data domain (e.g., `user`, `spouse`) in its own file for clarity and separation.

## Quiz Implementation

- Follow the `QuizScreen` → `QuizPage` structure; UI lives in `@/components/quiz`, orchestration helpers stay in `@/lib/quiz`.
- Pick the right callback for `QuizPage`: `onSuccess` for simple acceptance, `onSubmit` when you may reject data (return `true`/`false`).
- Quiz pages always need titles and field translations; derive keys from the service → quiz → screen → page → field hierarchy to keep them consistent (e.g., `services.i589.info.employment-history.jobs.employer-name.label`).
- Review similar quiz files before adding new ones, and never consume quiz components outside of quiz flows.

## PDF Services

```txt
@/lib/services/<service>/form/
├── *-fields.ts     # Data-only definitions per PDF section
├── pdf.ts          # PDF assembly/orchestration
└── types.ts        # Shared TypeScript types
```

- Keep field definitions modular and data-focused; consolidate PDF logic inside `pdf.ts`.
- If a service produces multiple PDFs, organize them per file without introducing unnecessary complexity.

## Localization

- Never leave user-facing strings inline—use translated components or the translation hook.
- Translation files live at `src/assets/translations/en.json` and `src/assets/translations/es.json`; keep keys hierarchical and kebab-case (e.g., `form.address.street-number`).
- Prefer `<TransText>`, `<TransButton>`, and related translated primitives; fall back to `useT()` only when needed (screen titles, placeholders, etc.).
- Always add keys for both English and Spanish.

## Styling

- Default to `tw`...` template literals for static styling.
- Use `tw.style()` when combining classes with conditional styles or theme values, and only fall back to inline `style={{}}` for navigation props or unavoidable React Native APIs.
- Mix approaches with arrays as needed: ``style={[tw`base-class`, dynamicStyle]}``.

## UI Dependencies

- `@/components/quiz` may depend on `@/components/form`, which in turn may depend on `@/components/ui`; keep that direction and avoid circular coupling.
- Quiz components should stay thin, delegating generic RHF work to form components.

## Development Practices & Quality

- Mirror existing conventions—consistency across files and services matters more than personal preference.
- Key stack expectations: react-hook-form + Zod for forms, Jotai + MMKV for state, twrnc for styling, Expo Router for navigation, `@cantoo/pdf-lib` for PDFs, and react-i18next for localization.
- Adhere to TypeScript strictness, provide accurate generics, and validate with Zod where appropriate.
- Respect naming conventions: kebab-case files (`contact-info.tsx`), PascalCase components, camelCase utilities.
- Use comments sparingly—prefer self-documenting code and clear naming.
- Quality gates: ESLint, Prettier, Husky hooks, and `pnpm run build:check`.
- Review adjacent implementations before introducing new features to maintain cohesion across the project.
