import React from 'react';

import { render } from '@testing-library/react-native';

jest.mock('react-native-reanimated', () => {
  const React = require('react');

  class MockAnimation {
    duration(ms) {
      return this;
    }
  }

  return {
    __esModule: true,
    default: {
      Text: React.forwardRef(function AnimatedText({ children, entering, exiting, style, testID, ...props }, ref) {
        const { Text } = require('react-native');
        return (
          <Text ref={ref} testID={testID || 'animated-text'}
            entering={entering} exiting={exiting} style={style} {...props}>
            {children}
          </Text>
        );
      }),
    },
    FadeIn: new MockAnimation(),
    FadeOut: new MockAnimation(),
  };
});

import { AnimatedText } from './animated-text';

describe('AnimatedText', () => {
  it('children 텍스트가 렌더링된다', () => {
    const { getByText } = render(
      <AnimatedText>안녕하세요</AnimatedText>,
    );
    expect(getByText('안녕하세요')).toBeTruthy();
  });

  it('isEntering=true일 때 FadeIn entering 애니메이션이 적용된다', () => {
    const { getByTestId } = render(
      <AnimatedText testID="anim-text" isEntering={true}>텍스트</AnimatedText>,
    );
    const entering = getByTestId('anim-text').props.entering;
    expect(entering).toBeDefined();
    expect(entering).not.toBeUndefined();
  });

  it('isExiting=true일 때 FadeOut exiting 애니메이션이 적용된다', () => {
    const { getByTestId } = render(
      <AnimatedText testID="anim-text" isExiting={true}>텍스트</AnimatedText>,
    );
    const exiting = getByTestId('anim-text').props.exiting;
    expect(exiting).toBeDefined();
    expect(exiting).not.toBeUndefined();
  });

  it('isEntering=false일 때 entering이 undefined이다', () => {
    const { getByTestId } = render(
      <AnimatedText testID="anim-text" isEntering={false}>텍스트</AnimatedText>,
    );
    expect(getByTestId('anim-text').props.entering).toBeUndefined();
  });

  it('delay prop이 FadeIn.duration에 전달된다', () => {
    const reanimated = require('react-native-reanimated');
    const spy = jest.spyOn(reanimated.FadeIn, 'duration');
    render(
      <AnimatedText isEntering={true} delay={500} testID="anim-text">텍스트</AnimatedText>,
    );
    expect(spy).toHaveBeenCalledWith(500);
    spy.mockRestore();
  });
});
