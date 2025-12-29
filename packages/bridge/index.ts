export const WEBVIEW_MESSAGE_TYPE = {
    NAVIGATE: 'NAVIGATE',
} as const;

export type WebViewMessageType = keyof typeof WEBVIEW_MESSAGE_TYPE;

export interface WebViewMessage<T = any> {
    type: WebViewMessageType;   
    data?: T;
}
