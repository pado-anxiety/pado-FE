const mockStorage = new Map();

module.exports = {
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn((key) => mockStorage.get(key)),
    getBoolean: jest.fn((key) => mockStorage.get(key)),
    set: jest.fn((key, value) => mockStorage.set(key, value)),
    delete: jest.fn((key) => mockStorage.delete(key)),
    contains: jest.fn((key) => mockStorage.has(key)),
    clearAll: jest.fn(() => mockStorage.clear()),
  })),
  createMMKV: jest.fn(() => ({
    getString: jest.fn((key) => mockStorage.get(key)),
    getBoolean: jest.fn((key) => mockStorage.get(key)),
    set: jest.fn((key, value) => mockStorage.set(key, value)),
    delete: jest.fn((key) => mockStorage.delete(key)),
    contains: jest.fn((key) => mockStorage.has(key)),
    clearAll: jest.fn(() => mockStorage.clear()),
  })),
  __mockStorage: mockStorage,
};
