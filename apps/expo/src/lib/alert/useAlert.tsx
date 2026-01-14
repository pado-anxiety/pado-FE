import { create } from 'zustand';

interface AlertStore {
  isAlertOpen: boolean;
  title: string;
  message: string;
  onPress?: null | (() => void);
  openAlert: (title: string, message: string, onPress?: () => void) => void;
  closeAlert: () => void;
}

export const useAlert = create<AlertStore>((set, get) => ({
  isAlertOpen: false,
  title: '',
  message: '',
  onPress: null,
  openAlert: (title: string, message: string, onPress?: () => void) =>
    set({ isAlertOpen: true, title, message, onPress }),
  closeAlert: () => {
    const { onPress } = get();
    if (onPress) {
      onPress();
    }
    set({ isAlertOpen: false, title: '', message: '', onPress: null });
  },
}));
