const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');
const eslintConfigCustom = require('@pado/eslint-config-custom');

module.exports = defineConfig([
  globalIgnores(['dist/*', '.expo/*', 'node_modules/*', 'web-build/*']),

  ...[].concat(expoConfig),
  ...[].concat(eslintConfigCustom),

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
    files: ['*.config.js', 'env.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'jest-setup.js', '__mocks__/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);
