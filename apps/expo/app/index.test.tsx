/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import HomeScreen from './index';

const mockIsOnboarded = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text testID="redirect">{href}</Text>;
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutate: jest.fn() }),
}));

jest.mock('@src/lib', () => ({
  isOnboarded: () => mockIsOnboarded(),
}));

jest.mock('@src/lib/auth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@src/lib/analytics', () => ({
  useAnalytics: () => ({ identifyUser: jest.fn() }),
}));

jest.mock('@src/lib/alert', () => ({
  showAlert: { error: jest.fn() },
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    ONBOARD: '/onboard',
  },
}));

jest.mock('@src/lib/api/history', () => ({
  historyAPI: { getDetail: jest.fn() },
}));

jest.mock('@src/features/history', () => ({
  HistoryModalContent: () => null,
}));

jest.mock('@src/components/ui', () => {
  const { View, Text } = require('react-native');
  return {
    LoadingSpinner: () => null,
    Text: ({ children, ...props }: { children: React.ReactNode }) => (
      <Text {...props}>{children}</Text>
    ),
    View: ({ children, ...props }: { children: React.ReactNode }) => (
      <View {...props}>{children}</View>
    ),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    FlatList: ({
      ListHeaderComponent,
      ListFooterComponent,
    }: {
      ListHeaderComponent: React.ReactNode;
      ListFooterComponent: React.ReactNode;
    }) => (
      <View testID="flatlist">
        {ListHeaderComponent}
        {ListFooterComponent}
      </View>
    ),
  };
});

jest.mock('@src/features/home/hooks', () => ({
  useHomePageState: () => {
    const React = require('react');
    const [page, setPage] = React.useState('HOME');
    return { page, setPage };
  },
  useHistoryInfiniteQuery: () => ({
    data: { pages: [] },
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isPending: false,
    isFetchingNextPage: false,
  }),
  useHomeListData: () => [],
}));

jest.mock('@src/features/home', () => {
  const { Text, TouchableOpacity, View } = require('react-native');
  return {
    HomeListHeader: ({
      page,
      setPage,
    }: {
      page: string;
      setPage: (p: string) => void;
    }) => (
      <View>
        {page === 'HOME' && (
          <>
            <TouchableOpacity onPress={() => setPage('HISTORY')}>
              <Text>home.menu.viewActHistory</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPage('LEARNING')}>
              <Text>home.menu.learning</Text>
            </TouchableOpacity>
          </>
        )}
        {page === 'HISTORY' && <Text>history-page</Text>}
        {page === 'LEARNING' && <Text>learning-page</Text>}
      </View>
    ),
    HomeListItem: () => null,
    HomeListFooter: () => null,
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsOnboarded.mockReturnValue(true);
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      name: 'TestUser',
      email: 'test@test.com',
    });
  });

  describe('리다이렉트', () => {
    it('onboard_status가 없으면 온보딩 화면으로 이동한다', () => {
      mockIsOnboarded.mockReturnValue(false);

      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId('redirect').props.children).toBe('/onboard');
    });

    it('로그인되어 있지 않으면 로그인 화면으로 이동한다', () => {
      mockUseAuth.mockReturnValue({
        isLoggedIn: false,
        name: null,
        email: null,
      });

      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId('redirect').props.children).toBe('/login');
    });

    it('온보딩 미완료가 로그인보다 우선한다', () => {
      mockIsOnboarded.mockReturnValue(false);
      mockUseAuth.mockReturnValue({
        isLoggedIn: false,
        name: null,
        email: null,
      });

      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId('redirect').props.children).toBe('/onboard');
    });
  });

  describe('렌더링', () => {
    it('온보딩 완료 + 로그인 상태에서 홈 화면이 렌더링된다', () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId('flatlist')).toBeTruthy();
    });
  });

  describe('탭 메뉴 이동', () => {
    it('기록 메뉴를 누르면 HISTORY 페이지로 전환된다', () => {
      const { getByText } = render(<HomeScreen />);

      fireEvent.press(getByText('home.menu.viewActHistory'));

      expect(getByText('history-page')).toBeTruthy();
    });

    it('학습 메뉴를 누르면 LEARNING 페이지로 전환된다', () => {
      const { getByText } = render(<HomeScreen />);

      fireEvent.press(getByText('home.menu.learning'));

      expect(getByText('learning-page')).toBeTruthy();
    });
  });
});
