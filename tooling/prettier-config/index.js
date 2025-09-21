/// <reference types="./types.d.ts" />

import * as prettierPluginTailwindcss from 'prettier-plugin-tailwindcss';
import prettierPluginSql from 'prettier-plugin-sql';
import prettierPluginToml from 'prettier-plugin-toml';
import * as prettierPluginPackagejson from 'prettier-plugin-packagejson';
import * as prettierPluginSh from 'prettier-plugin-sh';

/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: [
    prettierPluginTailwindcss,
    prettierPluginSql,
    prettierPluginToml,
    prettierPluginPackagejson,
    prettierPluginSh,
  ],
  trailingComma: 'es5',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
};

/** @type {import('prettier-plugin-tailwindcss').PluginOptions} */
const prettierPluginTailwindConfig = {
  tailwindFunctions: ['clsx', 'cva', 'cn', 'twc', 'tw', 'style'],
  tailwindAttributes: ['className'],
};

/** @type {import('prettier-plugin-sql').SqlBaseOptions} */
const prettierPluginSqlConfig = {
  language: 'postgresql',
  keywordCase: 'lower',
  dataTypeCase: 'lower',
  functionCase: 'lower',
  identifierCase: 'lower',
};

export default {
  ...prettierConfig,
  ...prettierPluginTailwindConfig,
  ...prettierPluginSqlConfig,
};
