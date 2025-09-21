import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import tseslint from 'typescript-eslint';
import eslintJs from '@eslint/js';

// We can't use the shared eslint config because it depends on this package
// for formatting, creating a circular dependency.

export default defineConfig([
  includeIgnoreFile(path.join(import.meta.dirname, '../../.gitignore')),
  eslintJs.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
]);
