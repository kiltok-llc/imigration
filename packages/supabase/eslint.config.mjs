import baseConfig from '@repo/eslint-config/base';
import typescriptConfig from '@repo/eslint-config/typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['**/gen'],
  },
  typescriptConfig,
  baseConfig,
]);
