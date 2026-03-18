import { create } from 'zustand';

interface AlertStore {
  isAlertOpen: boolean;
  title: string;
  message: string;
  isConfirm: boolean;
  onPress?: null | (() => void);
  onConfirm?: null | (() => void);
  openAlert: (title: string, message: string, onPress?: () => void) => void;
  openConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => void;
  /** Closes the alert and runs the onPress callback if set */
  dismissAlert: () => void;
  /** @deprecated Use dismissAlert instead */
  closeAlert: () => void;
  confirmAlert: () => void;
}

export const useAlert = create<AlertStore>((set, get) => ({
  isAlertOpen: false,
  title: '',
  message: '',
  isConfirm: false,
  onPress: null,
  onConfirm: null,
  openAlert: (title: string, message: string, onPress?: () => void) =>
    set({ isAlertOpen: true, title, message, onPress, isConfirm: false, onConfirm: null }),
  openConfirm: (title: string, message: string, onConfirm: () => void) =>
    set({ isAlertOpen: true, title, message, isConfirm: true, onConfirm, onPress: null }),
  dismissAlert: () => {
    const { onPress } = get();
    if (onPress) {
      onPress();
    }
    set({ isAlertOpen: false, title: '', message: '', onPress: null, isConfirm: false, onConfirm: null });
  },
  closeAlert: () => {
    // Backward-compatible alias for dismissAlert
    get().dismissAlert();
  },
  confirmAlert: () => {
    const { onConfirm } = get();
    if (onConfirm) {
      onConfirm();
    }
    set({ isAlertOpen: false, title: '', message: '', onPress: null, isConfirm: false, onConfirm: null });
  },
}));
