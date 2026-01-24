import React from 'react';

import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@src/components/ui', () => {
  const React = require('react');
  const { View: RNView } = require('react-native');
  return {
    View: ({ className, style, children, ...props }) => (
      <RNView {...props} testID="safe-area-view" className={className} style={style}>
        {children}
      </RNView>
    ),
  };
});

import PageSafeAreaView from './page-safe-area-view';

describe('PageSafeAreaView', () => {
  it('children이 렌더링된다', () => {
    const { getByText } = render(
      <PageSafeAreaView>
        <Text>자식 컴포넌트</Text>
      </PageSafeAreaView>,
    );
    expect(getByText('자식 컴포넌트')).toBeTruthy();
  });

  it('useSafeAreaInsets의 top/bottom이 paddingTop/paddingBottom으로 적용된다', () => {
    const { getByTestId } = render(
      <PageSafeAreaView>
        <Text>내용</Text>
      </PageSafeAreaView>,
    );
    const view = getByTestId('safe-area-view');
    expect(view.props.style).toEqual(
      expect.objectContaining({
        paddingTop: 44,
        paddingBottom: 34,
      }),
    );
  });

  it('className prop이 View에 전달된다', () => {
    const { getByTestId } = render(
      <PageSafeAreaView className="bg-white">
        <Text>내용</Text>
      </PageSafeAreaView>,
    );
    const view = getByTestId('safe-area-view');
    expect(view.props.className).toContain('bg-white');
  });
});
