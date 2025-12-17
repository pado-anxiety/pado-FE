import { useCallback, useState } from 'react';

interface UseChatModalReturn {
  isChatModalVisible: boolean;
  setIsChatModalVisible: (visible: boolean) => void;
  closeModal: () => void;
  openModal: () => void;
}

export function useChatModal(): UseChatModalReturn {
  const [isChatModalVisible, setIsChatModalVisible] = useState<boolean>(false);

  const closeModal = useCallback(() => {
    setIsChatModalVisible(false);
  }, []);

  const openModal = useCallback(() => {
    setIsChatModalVisible(true);
  }, []);

  return {
    isChatModalVisible,
    setIsChatModalVisible,
    closeModal,
    openModal,
  };
}
