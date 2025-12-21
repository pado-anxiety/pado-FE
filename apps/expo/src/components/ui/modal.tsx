/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useImperativeHandle, useMemo, useRef } from 'react';

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Keyboard, StyleProp, ViewStyle } from 'react-native';

export const useModal = () => {
  const ref = useRef<BottomSheetModal>(null);

  const present = useCallback((data?: any) => ref.current?.present(data), []);

  const dismiss = useCallback(() => ref.current?.dismiss(), []);

  return { ref, present, dismiss };
};

export function Modal({
  ref,
  snapPoints,
  detached,
  backgroundStyle,
  handleIndicatorStyle,
  onDismiss,
  children,
  ...props
}: {
  ref: React.Ref<BottomSheetModal>;
  snapPoints?: string[];
  detached?: boolean;
  backgroundStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  onDismiss?: () => void;
  children: React.ReactNode;
}) {
  const modal = useModal();

  const _snapPoints = useMemo(() => snapPoints, [snapPoints]);

  const _detachedProps = useMemo(() => getDetachedProps(detached), [detached]);

  useImperativeHandle(
    ref,
    () => (modal.ref.current as BottomSheetModal) || null,
  );

  return (
    <BottomSheetModal
      ref={modal.ref}
      backdropComponent={renderBackdrop}
      snapPoints={_snapPoints}
      enableDynamicSizing={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
      onDismiss={onDismiss}
      {..._detachedProps}
      {...props}
    >
      <BottomSheetView className="flex-1 items-center justify-center gap-4 p-5 pb-12">
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const renderBackdrop = (props: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.4}
      onPress={Keyboard.dismiss}
      pressBehavior="close"
    />
  );
};

const getDetachedProps = (detached?: boolean) => {
  if (detached) {
    return {
      detached: true,
      bottomInset: 40,
      style: { marginHorizontal: 16, borderRadius: 16 },
    };
  }
  return {};
};
