# Testing Guide for Chat Feature

## Quick Start

### 1. Install Test Dependencies

```bash
cd apps/expo
yarn add -D jest@^29.7.0 jest-expo@^52.0.0 @testing-library/react-native@^12.4.0 @testing-library/jest-native@^5.4.3 react-test-renderer@19.1.0
```

### 2. Add Test Scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### 3. Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode (auto-rerun on file changes)
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Run tests in CI environment
yarn test:ci
```

## Test Structure