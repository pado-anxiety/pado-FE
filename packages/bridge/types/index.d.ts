export declare const WEBVIEW_MESSAGE_TYPE: {
    readonly NAVIGATE: "NAVIGATE";
    readonly COMPLETE: "COMPLETE";
    readonly ERROR: "ERROR";
    readonly HAPTIC: "HAPTIC";
    readonly VALIDATE: "VALIDATE";
};
export type NavigateAction = 'NEXT' | 'HOME' | 'BACK' | 'LOGIN';
export type HapticType = 'NAVIGATE' | 'EFFECT' | 'SELECT';
export interface WebViewMessagePayload {
    [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {
        action: NavigateAction;
        step?: number;
        duration: number;
    };
    [WEBVIEW_MESSAGE_TYPE.COMPLETE]: {
        data: any;
    };
    [WEBVIEW_MESSAGE_TYPE.ERROR]: {
        error: string;
    };
    [WEBVIEW_MESSAGE_TYPE.HAPTIC]: {
        type: HapticType;
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