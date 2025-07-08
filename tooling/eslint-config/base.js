/// <reference types="./types.d.ts" />

import { includeIgnoreFile } from '@eslint/compat';
import eslintPluginCanonical from 'eslint-plugin-canonical';
import eslintPluginMarkdown from 'eslint-plugin-markdown';
import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginTurbo from 'eslint-plugin-turbo';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginVitest from 'eslint-plugin-vitest';
import { defineConfig } from 'eslint/config';
import path from 'node:path';

export default defineConfig([
  includeIgnoreFile(path.join(import.meta.dirname, '../../.gitignore')),
  {
    ignores: ['**/*.config.*', '**/.lintstagedrc.js'],
  },
  eslintPluginMarkdown.configs.recommended,
  eslintPluginPerfectionist.configs['recommended-natural'],
  eslintPluginPromise.configs['flat/recommended'],
  eslintPluginNode.configs['flat/recommended'],
  eslintPluginUnicorn.configs.recommended,
  eslintPluginTurbo.configs['flat/recommended'],
  eslintPluginCanonical.configs['flat/recommended'],
  {
    ignores: ['**/env.ts'],
    rules: {
      'n/no-process-env': 'error',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
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
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'canonical/destructuring-property-newline': 'off',
      'canonical/export-specifier-newline': 'off',
      'canonical/id-match': 'off',
      'canonical/import-specifier-newline': 'off',
      curly: 'error',
      eqeqeq: 'error',
      'import-x/no-named-as-default-member': 'off',
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      // Must disable the base rule for @typescript-eslint/no-unused-vars to work properly
      'no-unused-vars': 'off',
      'object-shorthand': 'error',
      'perfectionist/sort-objects': [
        'error',
        {
          partitionByNewLine: true,
        },
      ],
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-destructuring': 'error',
      'prefer-template': 'error',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
  },
  {
    extends: [eslintPluginVitest.configs.recommended],
    files: [
      '**/*.{spec,test}.{ts,tsx}',
      '**/{tests,test,__tests__,__mock__,__mocks__,testing}/*.ts',
    ],
    plugins: {
      vitest: eslintPluginVitest,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-implied-eval': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'unicorn/error-message': 'off',
      'unicorn/no-await-expression-member': 'off',
    },
  },
]);
