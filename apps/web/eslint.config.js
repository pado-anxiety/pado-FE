import babelParser from '@babel/eslint-parser';
import nextTs from 'eslint-config-next/typescript';

import eslintConfigCustom from '@nyangtodac/eslint-config-custom';

// Manually patch the missing parser
const patchedParser = {
  parse: babelParser.parse,
  parseForESLint: babelParser.parseForESLint,
  meta: {
    name: '@babel/eslint-parser',
    version: '7.28.5',
  },
};

// Create a mock module for Next.js to use
if (!globalThis.__NEXT_BABEL_PARSER_PATCHED__) {
  const Module = await import('module');
  const originalRequire = Module.default.prototype.require;
  Module.default.prototype.require = function (id) {
    if (id === 'next/dist/compiled/babel/eslint-parser') {
      return patchedParser;
    }
    return originalRequire.apply(this, arguments);
  };
  globalThis.__NEXT_BABEL_PARSER_PATCHED__ = true;
}

const { default: nextConfig } =
  await import('eslint-config-next/core-web-vitals');

const eslintConfig = [
  ...nextConfig,
  ...nextTs,
  ...eslintConfigCustom,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react-hooks/exhaustive-deps': 'warn',

      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',

      'import/order': 'off',
      'sort-imports': 'off',

      'import/no-duplicates': 'error',

      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'warn',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs'],
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'postcss.config.js',
      'tailwind.config.js',
    ],
  },
];

export default eslintConfig;
