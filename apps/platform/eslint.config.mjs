import { FlatCompat } from '@eslint/eslintrc';
import baseConfig from '@repo/eslint-config/base';
import { defineConfig } from 'eslint/config';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  {
    extends: [compat.extends('next/core-web-vitals', 'next/typescript')],
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
  },
  baseConfig,
]);
