module.exports = {
  styled: (Component) => Component,
  cssInterop: () => {},
  remapProps: () => {},
  NativeWindStyleSheet: {
    create: jest.fn(),
    setVariables: jest.fn(),
  },
  useColorScheme: () => ({
    colorScheme: 'light',
    setColorScheme: jest.fn(),
    toggleColorScheme: jest.fn(),
  }),
};
