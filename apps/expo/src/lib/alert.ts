import { Alert } from 'react-native';

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

export const Dialog = {
  show: (options: DialogOptions): void => {
    const { title, textBody, button = '확인', onPressButton } = options;

    const buttons = [
      {
        text: button,
        onPress: onPressButton ?? (() => {}),
      },
    ];

    Alert.alert(title, textBody, buttons);
  },
};

export const Toast = {
  show: (options: ToastOptions): void => {
    const { title, textBody } = options;
    Alert.alert(title, textBody);
  },
};

export const showAlert = {
  error: (title: string, message?: string, onPress?: () => void): void => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title,
      textBody: message,
      onPressButton: onPress,
    });
  },

  success: (title: string, message?: string, onPress?: () => void): void => {
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title,
      textBody: message,
      onPressButton: onPress,
    });
  },

  warning: (title: string, message?: string, onPress?: () => void): void => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title,
      textBody: message,
      onPressButton: onPress,
    });
  },

  info: (title: string, message?: string, onPress?: () => void): void => {
    Dialog.show({
      type: ALERT_TYPE.INFO,
      title,
      textBody: message,
      onPressButton: onPress,
    });
  },

  validation: (title: string, message: string): void => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title,
      textBody: message,
    });
  },
};
