export declare const WEBVIEW_MESSAGE_TYPE: {
    readonly NAVIGATE: "NAVIGATE";
    readonly DATA: "DATA";
    readonly ERROR: "ERROR";
    readonly HAPTIC: "HAPTIC";
    readonly VALIDATE: "VALIDATE";
};
export interface WebViewMessagePayload {
    [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {
        action: string;
    };
    [WEBVIEW_MESSAGE_TYPE.DATA]: {
        data: any;
    };
    [WEBVIEW_MESSAGE_TYPE.ERROR]: {
        error: string;
    };
    [WEBVIEW_MESSAGE_TYPE.HAPTIC]: {
        type: string;
    };
    [WEBVIEW_MESSAGE_TYPE.VALIDATE]: {
        title: string;
        message: string;
    };
}
export type WebViewMessageType = keyof WebViewMessagePayload;
export interface WebViewMessage<K extends WebViewMessageType> {
    type: K;
    data: WebViewMessagePayload[K];
}
//# sourceMappingURL=index.d.ts.map