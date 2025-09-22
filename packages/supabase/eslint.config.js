import baseConfig from '@repo/eslint-config/base';
import typescriptConfig from '@repo/eslint-config/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['gen/']),
  typescriptConfig,
  baseConfig,
]);
