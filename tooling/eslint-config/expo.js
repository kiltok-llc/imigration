import { defineConfig } from 'eslint/config';

export default defineConfig([
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
      'unicorn/no-array-sort': 'off', // https://github.com/facebook/hermes/pull/1298
    },
  },
]);
