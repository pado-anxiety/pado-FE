export declare const WEBVIEW_MESSAGE_TYPE: {
    readonly NAVIGATE: "NAVIGATE";
    readonly DATA: "DATA";
};
export interface WebViewMessagePayload {
    [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {};
    [WEBVIEW_MESSAGE_TYPE.DATA]: {
        data: any;
    };
}
export type WebViewMessageType = keyof WebViewMessagePayload;
export interface WebViewMessage<K extends WebViewMessageType> {
    type: K;
    data: WebViewMessagePayload[K];
}
//# sourceMappingURL=index.d.ts.map