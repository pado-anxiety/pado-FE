const path = require('path');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest-shim.js'],
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
    // Expo HMR/Winter 모듈 모킹 (location.protocol 에러 방지)
    '^expo/src/winter(.*)$': '<rootDir>/__mocks__/expo-winter.js',
    // Expo 및 네이티브 모듈 모킹
    '^expo-secure-store$': '<rootDir>/__mocks__/expo-secure-store.js',
    '^expo-apple-authentication$': '<rootDir>/__mocks__/expo-apple-authentication.js',
    '^expo-router$': '<rootDir>/__mocks__/expo-router.js',
    '^expo-constants$': '<rootDir>/__mocks__/expo-constants.js',
    '^nativewind$': '<rootDir>/__mocks__/nativewind.js',
    '^react-native-css-interop$': '<rootDir>/__mocks__/react-native-css-interop.js',
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native-gesture-handler$': '<rootDir>/__mocks__/react-native-gesture-handler.js',
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
