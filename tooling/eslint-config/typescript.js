import eslintJs from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
    ],
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
  },
]);
