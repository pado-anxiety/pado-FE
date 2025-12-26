import { Modal, useModal } from '@src/components/ui';
import { View } from 'react-native';

import { Button, Text } from '@pado/ui';

export default function ModalPage() {
  const { ref: modalRef, present, dismiss } = useModal();

  const {
    ref: detachedModalRef,
    present: presentDetached,
    dismiss: dismissDetached,
  } = useModal();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-page px-4">
      <Button
        text="Open Modal"
        onPress={() => present()}
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
      <Modal ref={modalRef}>
        <Text
          tx="hello"
          className="text-2xl font-bold text-body"
        />
        <Button
          text="Close Modal"
          onPress={() => dismiss()}
          color="primary"
          size="default"
          disabled={false}
          fullWidth={false}
        />
      </Modal>
      <Button
        text="Open detached Modal"
        onPress={() => presentDetached()}
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
      <Modal
        ref={detachedModalRef}
        detached
      >
        <Text
          tx="hello"
          className="text-2xl font-bold text-body"
        />
        <Button
          text="Close Modal"
          onPress={() => dismissDetached()}
          color="primary"
          size="default"
          disabled={false}
          fullWidth={false}
        />
      </Modal>
    </View>
  );
}
