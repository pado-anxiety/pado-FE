import { createContext, useContext, useState } from 'react';

interface CBTModalContextType {
  isCBTModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CBTModalContext = createContext<CBTModalContextType | undefined>(
  undefined,
);

export const CBTModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCBTModalVisible, setIsCBTModalVisible] = useState(false);

  const openModal = () => {
    setIsCBTModalVisible(true);
  };

  const closeModal = () => {
    setIsCBTModalVisible(false);
  };

  return (
    <CBTModalContext.Provider
      value={{ isCBTModalVisible, openModal, closeModal }}
    >
      {children}
    </CBTModalContext.Provider>
  );
};

export const useCBTModal = () => {
  const context = useContext(CBTModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
