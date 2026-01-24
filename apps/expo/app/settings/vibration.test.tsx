import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import VibrationScreen from './vibration';

const mockGetHapticState = jest.fn();
const mockSetHapticState = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
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
    NavButton: () => null,
    Pressable: ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
      <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
    ),
    Text: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
    View: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

jest.mock('@src/lib/haptics', () => ({
  getHapticState: () => mockGetHapticState(),
  setHapticState: (state: boolean) => mockSetHapticState(state),
}));

describe('VibrationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetHapticState.mockReturnValue(true);
  });

  it('진동 토글 클릭 시 상태가 반전된다 (true → false)', () => {
    mockGetHapticState.mockReturnValue(true);
    const { getByText } = render(<VibrationScreen />);

    fireEvent.press(getByText('common.settings.vibration'));

    expect(mockSetHapticState).toHaveBeenCalledWith(false);
  });

  it('진동 토글 클릭 시 상태가 반전된다 (false → true)', () => {
    mockGetHapticState.mockReturnValue(false);
    const { getByText } = render(<VibrationScreen />);

    fireEvent.press(getByText('common.settings.vibration'));

    expect(mockSetHapticState).toHaveBeenCalledWith(true);
  });
});
