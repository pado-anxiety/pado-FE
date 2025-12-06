// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');
const eslintConfigCustom = require('@nyangtodac/eslint-config-custom');

module.exports = defineConfig([
  globalIgnores(['dist/*', '/.expo', 'node_modules']),
  expoConfig,
  ...eslintConfigCustom,
  {
    files: ['babel.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ['tailwind.config.js', 'eslint.config.js', 'metro.config.js'],
  },
]);
