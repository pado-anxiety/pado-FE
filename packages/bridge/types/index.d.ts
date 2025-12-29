export declare const WEBVIEW_MESSAGE_TYPE: {
    readonly NAVIGATE: "NAVIGATE";
};
export interface WebViewMessagePayload {
    [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {};
}
export type WebViewMessageType = keyof WebViewMessagePayload;
export interface WebViewMessage<K extends WebViewMessageType> {
    type: K;
    data: WebViewMessagePayload[K];
}
//# sourceMappingURL=index.d.ts.map