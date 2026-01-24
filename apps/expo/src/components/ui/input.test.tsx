import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

const mockOnChange = jest.fn();
const mockOnBlur = jest.fn();
const mockFieldState: { error: { message: string } | undefined } = { error: undefined };

jest.mock('react-hook-form', () => ({
  useController: () => ({
    field: {
      ref: { current: null },
      onChange: mockOnChange,
      onBlur: mockOnBlur,
      value: '',
    },
    fieldState: mockFieldState,
  }),
}));

import { ControlledInput } from './input';

describe('Input', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFieldState.error = undefined;
  });

  it('label prop이 렌더링된다', () => {
    const { getByText } = render(
      <ControlledInput label="이름" control={{} as any} name="test" />,
    );
    expect(getByText('이름')).toBeTruthy();
  });

  it('텍스트 입력이 동작한다 (onChangeText)', () => {
    const { getByDisplayValue } = render(
      <ControlledInput control={{} as any} name="test" testID="input" />,
    );
    const input = getByDisplayValue('');
    fireEvent.changeText(input, '안녕하세요');
    expect(mockOnChange).toHaveBeenCalledWith('안녕하세요');
  });

  it('error prop이 있을 때 에러 메시지가 표시된다', () => {
    mockFieldState.error = { message: '필수 입력입니다' };
    const { getByText } = render(
      <ControlledInput control={{} as any} name="test" />,
    );
    expect(getByText('필수 입력입니다')).toBeTruthy();
  });

  it('error가 없을 때 에러 메시지가 표시되지 않는다', () => {
    mockFieldState.error = undefined;
    const { queryByText } = render(
      <ControlledInput control={{} as any} name="test" />,
    );
    expect(queryByText('필수 입력입니다')).toBeNull();
  });

  it('disabled 상태에서 스타일이 적용된다', () => {
    const { getByDisplayValue } = render(
      <ControlledInput control={{} as any} name="test" disabled={true} />,
    );
    const input = getByDisplayValue('');
    expect(input.props.className).toContain('opacity-50');
  });
});
