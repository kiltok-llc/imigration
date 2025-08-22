import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  compat.extends('expo'),
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              importNames: ['SafeAreaView'],
              message:
                'Import SafeAreaView from react-native-safe-area-context instead',
              name: 'react-native',
            },
            {
              importNames: ['Button'],
              message: 'import Button from @/components/ui/button instead',
              name: 'react-native-paper',
            },
          ],
        },
      ],
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '^(use[A-Za-z]+Ref)$',
        },
      ],
    },
  },
]);
