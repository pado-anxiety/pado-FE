module.exports = {
  GestureHandlerRootView: ({ children }) => children,
  Gesture: {
    Pan: jest.fn(() => ({})),
    Tap: jest.fn(() => ({})),
  },
  GestureDetector: ({ children }) => children,
};
