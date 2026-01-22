// eslint.config.js
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

  // 4. 설정 파일들을 위한 Node.js 전역 변수 허용 (module, require 등)
  {
    files: [
      '*.config.js',       // babel, tailwind, metro, jest, eslint config 등 모든 설정 파일
      'env.js', 
      'jest-setup.js'      // setup 파일도 node 환경 사용
    ],
    languageOptions: {
      globals: {
        ...globals.node,   // process, module, require 허용
      },
    },
  },

  // 5. 테스트 파일들을 위한 Jest 전역 변수 허용 (describe, it, expect 등)
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'jest-setup.js', '__mocks__/**'],
    languageOptions: {
      globals: {
        ...globals.jest,   // Jest 전역 함수 허용
      },
    },
  },
  {
    ignores: ['tailwind.config.js', 'eslint.config.js', 'metro.config.js', 'jest.config.js'],
  }
]);