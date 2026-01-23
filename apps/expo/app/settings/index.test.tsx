import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import SettingsScreen from './index';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockLogout = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('posthog-react-native', () => ({
  usePostHog: () => ({ reset: jest.fn() }),
}));

jest.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutate: jest.fn() }),
}));

jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetTextInput: 'BottomSheetTextInput',
}));

jest.mock('@src/components/layout/page-safe-area-view', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: ({ children }: { children: React.ReactNode }) => <View>{children}</View> };
});

jest.mock('@src/components/ui', () => {
  const { Text, TouchableOpacity, View } = require('react-native');
  return {
    Button: ({ text, onPress }: { text: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress}><Text>{text}</Text></TouchableOpacity>
    ),
    Modal: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    NavButton: () => null,
    Pressable: ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
      <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
    ),
    Text: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
    View: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    useModal: () => ({ ref: { current: null }, present: jest.fn(), dismiss: jest.fn() }),
  };
});

jest.mock('@src/lib', () => ({
  ENV: { VERSION: '1.0.0' },
}));

jest.mock('@src/lib/api/user', () => ({
  userAPI: { sendFeedback: jest.fn() },
}));

jest.mock('@src/lib/auth', () => ({
  useAuth: () => ({
    logout: mockLogout,
    name: '테스트유저',
    email: 'test@example.com',
  }),
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: {
    LOGIN: '/login',
    SETTINGS: {
      LANGUAGE: '/settings/language',
      VIBRATION: '/settings/vibration',
      PRIVACY_POLICY: '/settings/policy',
      TERMS_OF_SERVICE: '/settings/terms',
      LICENSE_INFO: '/settings/license',
    },
  },
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: mockReplace,
    });
  });

  it('언어 설정으로 이동할 수 있다', () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('common.settings.language'));
    expect(mockPush).toHaveBeenCalledWith('/settings/language');
  });

  it('진동 설정으로 이동할 수 있다', () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('common.settings.vibration'));
    expect(mockPush).toHaveBeenCalledWith('/settings/vibration');
  });

  it('개인정보처리방침으로 이동할 수 있다', () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('common.settings.privacyPolicy'));
    expect(mockPush).toHaveBeenCalledWith('/settings/policy');
  });

  it('이용약관으로 이동할 수 있다', () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('common.settings.termsOfService'));
    expect(mockPush).toHaveBeenCalledWith('/settings/terms');
  });

  it('라이선스 정보로 이동할 수 있다', () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('common.settings.licenseInfo'));
    expect(mockPush).toHaveBeenCalledWith('/settings/license');
  });
});
