export declare const WEBVIEW_MESSAGE_TYPE: {
    readonly NAVIGATE: "NAVIGATE";
};
export type WebViewMessageType = keyof typeof WEBVIEW_MESSAGE_TYPE;
export interface WebViewMessage<T = any> {
    type: WebViewMessageType;
    data: T;
}
//# sourceMappingURL=index.d.ts.map