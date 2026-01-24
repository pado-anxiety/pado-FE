import React from 'react';

import { render } from '@testing-library/react-native';
import { renderHook, act } from '@testing-library/react-native';
import { Text } from 'react-native';

const mockPresent = jest.fn();
const mockDismiss = jest.fn();

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  return {
    BottomSheetModal: React.forwardRef(({ children, onDismiss, ...props }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        present: mockPresent,
        dismiss: mockDismiss,
      }));
      const { View } = require('react-native');
      return (
        <View testID="bottom-sheet-modal" {...props} onDismiss={onDismiss}>
          {children}
        </View>
      );
    }),
    BottomSheetView: ({ children }: any) => {
      const { View } = require('react-native');
      return <View testID="bottom-sheet-view">{children}</View>;
    },
    BottomSheetBackdrop: () => null,
  };
});

import { Modal, useModal } from './modal';

describe('useModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('present() 호출 시 BottomSheetModal.present()가 호출된다', () => {
    const { result } = renderHook(() => useModal());

    render(
      <Modal ref={result.current.ref}>
        <Text>내용</Text>
      </Modal>,
    );

    act(() => {
      result.current.present();
    });

    expect(mockPresent).toHaveBeenCalled();
  });

  it('dismiss() 호출 시 BottomSheetModal.dismiss()가 호출된다', () => {
    const { result } = renderHook(() => useModal());

    render(
      <Modal ref={result.current.ref}>
        <Text>내용</Text>
      </Modal>,
    );

    act(() => {
      result.current.dismiss();
    });

    expect(mockDismiss).toHaveBeenCalled();
  });
});

describe('Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('children이 렌더링된다', () => {
    const ref = React.createRef<any>();
    const { getByText } = render(
      <Modal ref={ref}>
        <Text>모달 내용</Text>
      </Modal>,
    );
    expect(getByText('모달 내용')).toBeTruthy();
  });

  it('onDismiss 콜백이 전달된다', () => {
    const onDismiss = jest.fn();
    const ref = React.createRef<any>();
    const { getByTestId } = render(
      <Modal ref={ref} onDismiss={onDismiss}>
        <Text>내용</Text>
      </Modal>,
    );
    expect(getByTestId('bottom-sheet-modal').props.onDismiss).toBe(onDismiss);
  });
});
