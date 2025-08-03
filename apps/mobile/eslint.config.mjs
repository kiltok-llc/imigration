import { FlatCompat } from '@eslint/eslintrc';
import baseConfig from '@repo/eslint-config/base';
import expoConfig from '@repo/eslint-config/expo';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [...compat.extends('expo'), ...baseConfig, ...expoConfig];
