export const WEBVIEW_MESSAGE_TYPE = {
    NAVIGATE: 'NAVIGATE',
} as const;

export interface WebViewMessagePayload {
    [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {},
    // ex)
    // [WEBVIEW_MESSAGE_TYPE.SHOW_TOAST]: { message: string; duration?: number };
}

export type WebViewMessageType = keyof WebViewMessagePayload;

export interface WebViewMessage<K extends WebViewMessageType> {
    type: K;
    data: WebViewMessagePayload[K];
}
