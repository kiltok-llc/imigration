# Development Guidelines

This document provides specific development guidelines for the iMigration Immigration App project - an Expo/React Native mobile application built with React, TypeScript, and modern tooling.

## Build/Configuration Instructions

### Prerequisites

- Node.js
- pnpm
- Expo CLI

### Setup

```bash
# Install dependencies
pnpm install

# Building
pnpm build:check # TypeScript compilation check

# Code Quality
pnpm lint     # Run ESLint with auto-fix
pnpm format   # Reformat project (only in monorepo root)
pnpm format . # Reformat current directory with Prettier
```

### Project Structure

- **Monorepo**: Uses Turbo + pnpm workspaces
- **Main app**: `apps/mobile/` (Expo/React Native)
- **Shared packages**: `packages/` and `tooling/`
- **Configuration**: Centralized in workspace root

## Testing Information

**⚠️ Important**: Testing is currently not configured. Do not attempt to create or run tests for this project.

## Development Guidelines

### Code Organization

#### Component Structure

```
src/components/
├── ui/           # Basic reusable UI components
├── form/         # Reusable react-hook-form components
├── quiz/         # Quiz-specific components (depends on form components)
└── migri/        # App-specific components
```

#### Library Structure

```
src/lib/
├── data/         # Jotai atoms with MMKV persistence
├── quiz/         # Quiz logic and state management
├── services/     # PDF generation and form handling
└── supabase/     # Database integration
```

### Data Management

**Pattern**: All personal user data must use MMKV-persisted jotai atoms managed from `@/lib/data/*.ts`.

**Example**:

```typescript
// src/lib/data/user.ts
import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { defaultStorage } from '@/lib/mmkv';

export const nameAtom = atomWithMmkvStorage(
  'name', // storage key
  DEFAULT_FORM_NAME, // default value
  NameSchema, // Zod validation schema
  defaultStorage // MMKV instance
);
```

**Key Points**:

- Each atom is individually defined with proper TypeScript typing
- Uses Zod schemas for validation
- Persists automatically to MMKV storage
- Separate files for different data entities (user.ts, spouse.ts, etc.)

### Quiz Implementation

**Structure**: Always follow `QuizScreen -> QuizPage` pattern.

**Example**:

```typescript
// Quiz screen wrapper
export default function MyQuiz() {
  return (
    <QuizScreen>
      <QuizPage
        pageId="page-1"
        schema={z.object({ field: z.string() })}
        defaultValues={{ field: '' }}
        onSuccess={(data) => {
          // Use for simple success handling
        }}
        // OR use onSubmit for validation/rejection
        onSubmit={(data) => {
          // Return false to reject submission
          return isDataValid(data);
        }}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name="field">
              <QuizTextInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
```

**Callback Usage**:

- **`onSuccess`**: Use when you don't need to reject data submissions
- **`onSubmit`**: Use when you need to validate and potentially reject submissions (return `true`/`false`)

**Guidelines**:

- Quiz logic (react ↔ data glue code) belongs in `@/lib/quiz`
- Quiz components (React UI) belong in `@/components/quiz`
- Always examine existing quiz files for consistency before creating new ones
- Look at similar quiz files for code patterns, surrounding files for content context

### PDF Generation

**Organization**: PDF generation is managed from `@/lib/services/$service/form/*.ts`

**Pattern**:

```
lib/services/i589/form/
├── client-fields.ts      # Client information fields
├── application-fields.ts # Application-specific fields
├── background-fields.ts  # Background information fields
├── spouse-fields.ts      # Spouse-related fields
├── pdf.ts               # Main PDF handling logic
└── types.ts             # Shared types
```

**Guidelines**:

- **Modularity**: Separate each set of fields/page into its own file
- **Data-focused**: Field modules should contain only data and minimal logic
- **PDF Logic**: Actual PDF handling logic goes in `services/$service/form/pdf.ts`
- **Multiple PDFs**: Organize accordingly but maintain modularity without unnecessary complexity

### Translations

**⚠️ Critical**: Never include user-facing text directly in code.

**Structure**:

```
src/assets/translations/
├── en.json    # English translations
└── es.json    # Spanish translations
```

**Translation Key Organization**:

```json
{
  "form": {
    "address": {
      "street": "Street address",
      "city": "City",
      "state": "State"
    },
    "boolean": {
      "yes": "Yes",
      "no": "No"
    }
  },
  "error": {
    "title": "An error occurred",
    "retry": "Retry"
  }
}
```

**Usage Patterns**:

**Option 1: Translated Components (Preferred when available)**:

```typescript
import { TransText, TransButton } from '@/components/trans';

// ✅ Best - using translated components
<TransText
  i18nKey='form.address.street'
  variant='headlineSmall'
  style={tw`font-bold`}
/>

<TransButton
  i18nKey='form.submit'
  mode='contained'
  onPress={handleSubmit}
/>
```

**Option 2: Translation Hook (when translated components aren't suitable)**:

```typescript
import { useT } from '@/lib/translation';

const t = useT();

// ✅ Good - using translation hook
<Text>{t('form.address.street')}</Text>
<Stack.Screen options={{ title: t('services.screenTitle') }} />
```

**❌ Wrong - hardcoded text**:

```typescript
<Text>Enter your address</Text>
<Button>Submit</Button>
```

**Available Translated Components**:

- `<TransText>` - Text component with built-in translation
- `<TransButton>` - Button component with built-in translation
- `<Trans>` - Advanced component for complex translations with markup

**Guidelines**:

- **Prefer translated components** when available - they provide cleaner APIs and better integration
- Use translation hook `t()` for cases where translated components aren't suitable (e.g., screen titles, placeholders)
- Use hierarchical organization (nested objects)
- Follow kebab-case for keys: `form.address.street-number`
- Add translation keys for ALL supported languages (en, es)
- Follow existing organizational, tonal, and naming practices
- Use contextual grouping (form._, error._, etc.)

### Styling with twrnc

**⚠️ Important**: Always prefer `tw`` template literals or `tw.style()`over inline`style={{}}` objects unless necessary.

**Usage Patterns**:

**Option 1: Template Literals (Preferred for static styles)**:

```typescript
import tw from 'twrnc';

// ✅ Best - for static Tailwind classes
<View style={tw`flex-1 gap-8 p-4`} />
<Text style={tw`font-semibold`} />
<ScrollView contentContainerStyle={tw`grow-1`} />
```

**Option 2: tw.style() (For dynamic styles and theme integration)**:

```typescript
import tw from 'twrnc';

// ✅ Good - combining classes with dynamic values
<TransText
  style={tw.style('font-bold', {
    color: theme.colors.primary,
  })}
/>

// ✅ Good - conditional styling
<Image style={tw.style('w-full', { aspectRatio: 4 })} />
<View style={tw.style('p-4', isPending && 'opacity-0')} />
```

**Option 3: Inline Objects (Only when necessary)**:

```typescript
// ✅ Acceptable - for simple theme values in navigation/library props
headerStyle: {
  backgroundColor: theme.colors.background,
}

// ✅ Acceptable - when using style variables
style={[tw.style('flex-1'), variableStyle]}
```

**❌ Avoid - unnecessary inline objects**:

```typescript
// Don't do this when you can use tw`` instead
<View style={{ flexDirection: 'row', gap: 8 }} />

// Use this instead
<View style={tw`flex-row gap-2`} />
```

**Guidelines**:

- **Prefer `tw`` template literals** for static Tailwind classes
- **Use `tw.style()`** when combining classes with dynamic values, theme colors, or conditional styles
- **Reserve `style={{}}` objects** for simple theme properties, navigation options, or when working with style variables
- **Combine approaches** when needed: `style={[tw.style('base-class'), dynamicStyle]}`

### UI Components

**Hierarchy**:

```
@/components/ui/      # Basic UI components (Button, Text, etc.)
@/components/form/    # Reusable react-hook-form components
@/components/quiz/    # Quiz components (usually depend on form components)
```

**Dependencies**:

- `quiz` components → `form` components (if applicable → `ui` components)
- Quiz components should depend on underlying, more generic RHF components
- Do NOT use quiz components or hooks outside of quizzes. Quiz components and hooks depend on quiz context and should not be used in non-quiz screens.
- Maintain clear separation of concerns -- RHF components handle RHF logic, quiz components handle quiz-specific logic (like quiz field names, labels, page context, etc)

### Development Best Practices

**Consistency**: Always mimic existing conventions, file structures, and naming schemes. Consistency is key.

**Key Dependencies**:

- **Forms**: react-hook-form with Zod validation
- **State**: Jotai atoms with MMKV persistence
- **Styling**: twrnc (Tailwind for React Native)
- **Navigation**: Expo Router
- **PDF**: @cantoo/pdf-lib
- **i18n**: react-i18next with custom translation hook

**TypeScript**:

- Strict typing throughout
- Zod schemas for runtime validation
- Proper generic types for reusable components

**File Naming**:

- kebab-case for files: `contact-info.tsx`
- PascalCase for components: `ContactInfo`
- camelCase for functions and variables

**Comments**:

- Do not include useless or obvious comments
- Do not label markup or designs with comments

### Code Quality

- **ESLint**: Configured with project-specific rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks
- **TypeScript**: Strict compilation checks

This project prioritizes maintainability, consistency, and clear separation of concerns. Always review similar existing implementations before adding new features.
