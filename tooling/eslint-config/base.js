import { includeIgnoreFile } from '@eslint/compat';
import eslintPluginMarkdown from '@eslint/markdown';
import eslintPluginCanonical from 'eslint-plugin-canonical';
import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import eslintPluginTurbo from 'eslint-plugin-turbo';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import path from 'node:path';

export default defineConfig([
  includeIgnoreFile(path.join(import.meta.dirname, '../../.gitignore')),
  {
    extends: [eslintPluginMarkdown.configs.recommended],
    files: ['**/*.md'],
  },
  {
    extends: [
      eslintPluginPerfectionist.configs['recommended-natural'],
      eslintPluginNode.configs['flat/recommended'],
      eslintPluginUnicorn.configs.recommended,
      eslintPluginTurbo.configs['flat/recommended'],
      eslintPluginCanonical.configs['flat/recommended'],
    ],
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    rules: {
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      'canonical/destructuring-property-newline': 'off',
      'canonical/export-specifier-newline': 'off',
      'canonical/id-match': 'off',
      'canonical/import-specifier-newline': 'off',
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      // Must disable the base rule for @typescript-eslint/no-unused-vars to work properly
      'no-unused-vars': 'off',
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-destructuring': 'error',
      'prefer-template': 'error',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  eslintPluginPrettier,
]);
