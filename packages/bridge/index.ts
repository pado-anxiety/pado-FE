export const WEBVIEW_MESSAGE_TYPE = {
    NAVIGATE: 'NAVIGATE',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
    HAPTIC: 'HAPTIC',
    VALIDATE: 'VALIDATE',
} as const;

export type NavigateAction = 'NEXT' | 'HOME' | 'BACK' | 'LOGIN';
export type HapticType = 'NAVIGATE' | 'EFFECT' | 'SELECT';

// COMPLETE 페이로드 타입 (ACT 단계별)
export type UserTextToken = {
    text: string;
    isSelected: boolean;
};
export type DetachCompletePayload = { data: UserTextToken[] };

export type ActionDomain = 'work' | 'growth' | 'leisure' | 'relationship';
export type ActionCompletePayload = {
    data: {
        selectedValue: Record<ActionDomain, number | null>;
        selectedDomain: ActionDomain;
        orientation: string;
        obstacle: string;
        action: string;
    };
};

export type DiaryCompletePayload = { data: string };

export type EmbraceCompletePayload = { data: { embraceResult: number } };

export type AnchorCompletePayload = { data: Record<string, never> };

export type CompletePayload =
    | DetachCompletePayload
    | ActionCompletePayload
    | DiaryCompletePayload
    | EmbraceCompletePayload
    | AnchorCompletePayload;

export interface WebViewMessagePayload {
    [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {
        action: NavigateAction;
        step?: number;
        duration: number;
    },
    [WEBVIEW_MESSAGE_TYPE.COMPLETE]: CompletePayload,
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
