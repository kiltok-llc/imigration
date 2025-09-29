import baseConfig from '@repo/eslint-config/base';
import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    extends: [expoConfig],
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    rules: {
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
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
    },
  },
  {
    extends: [baseConfig],
    ignores: ['eslint.config.mjs'],
    rules: {
      'unicorn/no-array-sort': 'off', // https://github.com/facebook/hermes/pull/1298
    },
  },
]);
