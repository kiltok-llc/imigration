import { includeIgnoreFile } from '@eslint/compat';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import tseslint from 'typescript-eslint';
import eslintJs from '@eslint/js';

export default defineConfig([
  includeIgnoreFile(path.join(import.meta.dirname, '../../.gitignore')),
  eslintJs.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginPrettier,
]);
