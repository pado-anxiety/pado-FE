const path = require('path');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|expo-modules-core|expo-router|expo-linking|expo-constants|expo-status-bar|expo-secure-store|expo-apple-authentication|nativewind|react-native-css-interop|react-native-reanimated|react-native-gesture-handler|react-native-mmkv|@gorhom/bottom-sheet|react-native-safe-area-context)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@pado/locales/(.*)$': '<rootDir>/../../packages/locales/$1',
    // Expo HMR/Winter 모듈 모킹 (location.protocol 에러 방지)
    '^expo/src/winter(.*)$': '<rootDir>/__mocks__/expo-winter.js',
    // jest-expo가 커버하지 않는 서드파티 모듈
    '^nativewind$': '<rootDir>/__mocks__/nativewind.js',
    '^react-native-css-interop$':
      '<rootDir>/__mocks__/react-native-css-interop.js',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.js',
  },
  moduleDirectories: [
    'node_modules',
    path.join(__dirname, '../../node_modules'),
  ],
  watchman: false,
  forceExit: true,
  testTimeout: 10000,
};
