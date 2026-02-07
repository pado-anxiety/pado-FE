import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import Button from '../../../../../packages/ui/src/components/Button';

describe('Button', () => {
  it('text prop이 올바르게 렌더링된다', () => {
    const { getByText } = render(
      <Button
        text="확인"
        testID="btn"
      />,
    );
    expect(getByText('확인')).toBeTruthy();
  });

  it('onPress 이벤트가 정상 호출된다', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button
        text="클릭"
        testID="btn"
        onPress={onPress}
      />,
    );
    fireEvent.press(getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disabled=true일 때 Pressable이 disabled된다', () => {
    const { getByTestId } = render(
      <Button
        text="비활성"
        testID="btn"
        disabled={true}
      />,
    );
    expect(getByTestId('btn').props.accessibilityState?.disabled).toBe(true);
  });

  it('disabled=true일 때 onPress가 호출되지 않는다', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button
        text="비활성"
        testID="btn"
        disabled={true}
        onPress={onPress}
      />,
    );
    fireEvent.press(getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('isLoading=true일 때 ActivityIndicator가 표시된다', () => {
    const { getByTestId } = render(
      <Button
        text="로딩"
        testID="btn"
        isLoading={true}
      />,
    );
    expect(getByTestId('btn-activity-indicator')).toBeTruthy();
  });

  it('isLoading=true일 때 onPress가 호출되지 않는다', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button
        text="로딩"
        testID="btn"
        isLoading={true}
        onPress={onPress}
      />,
    );
    fireEvent.press(getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('children이 있을 때 children이 렌더링된다', () => {
    const { getByText } = render(
      <Button testID="btn">
        <Text>커스텀 자식</Text>
      </Button>,
    );
    expect(getByText('커스텀 자식')).toBeTruthy();
  });
});
