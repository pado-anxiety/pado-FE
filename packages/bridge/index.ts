export const WEBVIEW_MESSAGE_TYPE = {
    NAVIGATE: 'NAVIGATE',
    DATA: 'DATA',
    ERROR: 'ERROR',
    HAPTIC: 'HAPTIC',
    VALIDATE: 'VALIDATE',
} as const;

export type NavigateAction = 'NEXT' | 'HOME' | 'BACK' | 'LOGIN';
export type HapticType = 'NAVIGATE' | 'EFFECT' | 'SELECT';

export interface WebViewMessagePayload {
    [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {
        action: NavigateAction;
        step?: number;
        duration: number;
    },
    [WEBVIEW_MESSAGE_TYPE.DATA]: {
        data: any;
    },
    [WEBVIEW_MESSAGE_TYPE.ERROR]: {
        error: string;
    },
    [WEBVIEW_MESSAGE_TYPE.HAPTIC]: {
        type: HapticType;
    },
    [WEBVIEW_MESSAGE_TYPE.VALIDATE]: {
        title: string;
        message: string;
    },
    // ex)
    // [WEBVIEW_MESSAGE_TYPE.SHOW_TOAST]: { message: string; duration?: number };
}

export type WebViewMessageType = keyof WebViewMessagePayload;

export interface WebViewMessage<K extends WebViewMessageType> {
    type: K;
    data: WebViewMessagePayload[K];
}
