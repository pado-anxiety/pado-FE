import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import LanguageScreen from './language';

const mockChangeLanguage = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('react-native-size-matters', () => ({
  scale: (size: number) => size,
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('@src/components/layout/page-safe-area-view', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: ({ children }: { children: React.ReactNode }) => <View>{children}</View> };
});

jest.mock('@src/components/ui', () => {
  const { Text, TouchableOpacity, View } = require('react-native');
  return {
    NavButton: ({ onPress }: { onPress?: () => void }) => (
      <TouchableOpacity testID="back-btn" onPress={onPress}><Text>back</Text></TouchableOpacity>
    ),
    Pressable: ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
      <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
    ),
    Text: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
    View: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

jest.mock('@src/lib/i18n', () => ({
  useLanguage: () => ({
    language: 'ko',
    changeLanguage: mockChangeLanguage,
  }),
}));

describe('LanguageScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('English 선택 시 언어가 en으로 변경된다', () => {
    const { getByText } = render(<LanguageScreen />);
    fireEvent.press(getByText('English'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('한국어 선택 시 언어가 ko로 변경된다', () => {
    const { getByText } = render(<LanguageScreen />);
    fireEvent.press(getByText('한국어'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('ko');
  });
});
