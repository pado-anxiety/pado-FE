import { useAlert } from './useAlert';

export const ALERT_TYPE = {
  SUCCESS: 'SUCCESS',
  DANGER: 'DANGER',
  WARNING: 'WARNING',
  INFO: 'INFO',
} as const;

export type AlertType = (typeof ALERT_TYPE)[keyof typeof ALERT_TYPE];

export interface DialogOptions {
  type?: AlertType;
  title: string;
  textBody?: string;
  button?: string;
  onPressButton?: () => void;
  autoClose?: number | boolean;
}

export interface ToastOptions {
  type?: AlertType;
  title: string;
  textBody?: string;
  autoClose?: number | boolean;
}

export const showAlert = {
  error: (title: string, message: string, onPress?: () => void): void => {
    useAlert.getState().openAlert(title, message, onPress);
  },

  // success: (title: string, message: string): void => {
  //   useAlert.getState().openAlert(title, message);
  // },

  warning: (title: string, message: string, onPress?: () => void): void => {
    useAlert.getState().openAlert(title, message, onPress);
  },

  // info: (title: string, message?: string, onPress?: () => void): void => {
  //   useAlert.getState().openAlert(title, message);
  // },

  validation: (title: string, message: string, onPress?: () => void): void => {
    useAlert.getState().openAlert(title, message, onPress);
  },
};
