import { createContext, useContext, useState } from 'react';

interface ChatModalContextType {
  isChatModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ChatModalContext = createContext<ChatModalContextType | undefined>(
  undefined,
);

export const ChatModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);

  const openModal = () => {
    setIsChatModalVisible(true);
  };

  const closeModal = () => {
    setIsChatModalVisible(false);
  };

  return (
    <ChatModalContext.Provider
      value={{ isChatModalVisible, openModal, closeModal }}
    >
      {children}
    </ChatModalContext.Provider>
  );
};

export const useChatModal = () => {
  const context = useContext(ChatModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
