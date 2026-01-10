export const WEBVIEW_MESSAGE_TYPE = {
    NAVIGATE: 'NAVIGATE',
    DATA: 'DATA',
    ERROR: 'ERROR',
    HAPTIC: 'HAPTIC',
} as const;

export interface WebViewMessagePayload {
    [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {
        action: string;
    },
    [WEBVIEW_MESSAGE_TYPE.DATA]: {
        data: any;
    },
    [WEBVIEW_MESSAGE_TYPE.ERROR]: {
        error: string;
    },
    [WEBVIEW_MESSAGE_TYPE.HAPTIC]: {
        type: string;
    },
    // ex)
    // [WEBVIEW_MESSAGE_TYPE.SHOW_TOAST]: { message: string; duration?: number };
}

export type WebViewMessageType = keyof WebViewMessagePayload;

export interface WebViewMessage<K extends WebViewMessageType> {
    type: K;
    data: WebViewMessagePayload[K];
}
