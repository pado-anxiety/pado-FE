// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');
const eslintConfigCustom = require('@pado/eslint-config-custom');

module.exports = defineConfig([
  globalIgnores(['dist/*', '/.expo', 'node_modules']),
  expoConfig,
  ...eslintConfigCustom,
  {
    rules: {
      'import/order': 'off',
      'sort-imports': 'off',
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true,
        },
      ],
    },
  },
  {
    files: ['babel.config.js', 'env.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ['tailwind.config.js', 'eslint.config.js', 'metro.config.js'],
  },
]);
