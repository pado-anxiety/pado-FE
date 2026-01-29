declare const resources: {
    readonly en: {
        readonly translation: {
            readonly common: {
                button: {
                    start: string;
                    next: string;
                    prev: string;
                    complete: string;
                    back: string;
                    close: string;
                    restart: string;
                    send: string;
                    goHome: string;
                    confirm: string;
                };
                loading: string;
                error: {
                    generic: string;
                    occurred: string;
                    tryLater: string;
                    tryAgainLater: string;
                    loginRequired: string;
                    goToLogin: string;
                    pageNotFound: string;
                    cannotLoadScreen: string;
                };
                validation: {
                    charLimitExceeded: string;
                    charLimitMessage: string;
                };
                empty: {
                    noRecords: string;
                };
                example: string;
                or: string;
                writeYourOwn: string;
                settings: {
                    title: string;
                    user: {
                        name: string;
                        email: string;
                    };
                    language: string;
                    vibration: string;
                    feedback: {
                        title: string;
                        description: string;
                        placeholder: string;
                        send: string;
                    };
                    privacyPolicy: string;
                    termsOfService: string;
                    appVersion: string;
                    licenseInfo: string;
                    licenseDescription: string;
                    logout: string;
                };
            };
            readonly act: {
                readonly common: {
                    title: {
                        anchor: string;
                        diary: string;
                        detach: string;
                        embrace: string;
                        values: string;
                    };
                    history: {
                        title: string;
                        subtitle: string;
                        viewHistory: string;
                    };
                    historyType: {
                        contactWithPresent: string;
                        emotionNote: string;
                        cognitiveDefusion: string;
                        acceptance: string;
                        values: string;
                    };
                };
                readonly anchor: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                    };
                    step: {
                        step1: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        step2: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        step3: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        step4: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        step5: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        hint: string;
                    };
                    result: {
                        title: string;
                        description: string[];
                    };
                    history: {
                        completed: string;
                    };
                };
                readonly diary: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                    };
                    step: {
                        step1: {
                            question: string;
                            description: string;
                            exampleBad: string;
                            exampleGood: string;
                        };
                        step2: {
                            question: string;
                            description: string;
                            exampleBad: string;
                            exampleGood: string;
                        };
                        step3: {
                            question: string;
                            description: string;
                        };
                        placeholder: string;
                    };
                    result: {
                        title: string;
                        description: string[];
                    };
                    history: {
                        situationQuestion: string;
                        thoughtQuestion: string;
                        emotionQuestion: string;
                    };
                };
                readonly detach: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                        button: string;
                    };
                    step: {
                        step1: {
                            title: string[];
                            description: string;
                            placeholder: string;
                        };
                        step2: {
                            title: string[];
                            description: string;
                        };
                    };
                    result: {
                        title: string[];
                        description: string[];
                    };
                    history: {
                        description: string;
                    };
                };
                readonly embrace: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                    };
                    step: {
                        startButton: string;
                        restartButton: string;
                    };
                    breath: {
                        inhale: string;
                        hold: string;
                        exhale: string;
                        completed: string;
                        restart: string;
                    };
                    result: {
                        title: string;
                        description: string[];
                        breathTime: string;
                    };
                    history: {
                        description: string;
                    };
                };
                readonly values: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                    };
                    step: {
                        step1: {
                            title: string;
                            description: string;
                        };
                        step2: {
                            title: string;
                            description: string;
                            placeholder: string;
                        };
                        step3: {
                            title: string;
                            description: string;
                            placeholder: string;
                        };
                        step4: {
                            title: string;
                            description: string;
                            placeholder: string;
                        };
                    };
                    domain: {
                        work: string;
                        leisure: string;
                        relationship: string;
                        growth: string;
                    };
                    result: {
                        title: string;
                        description: string[];
                        selectedDomain: string;
                        selectedValue: string;
                        orientation: string;
                        reason: string;
                        obstacle: string;
                        action: string;
                    };
                    history: {
                        title: string;
                        description: string;
                        matterQuestion: string;
                        valueQuestion: string;
                        barrierQuestion: string;
                        actionQuestion: string;
                    };
                };
            };
            readonly home: {
                greeting: string;
                menu: {
                    viewActHistory: string;
                    chatWithWind: string;
                    learning: string;
                    onboarding: string;
                    login: string;
                };
                app: {
                    name: string;
                    tagline: string;
                    description: string;
                };
                learning: {
                    title: string;
                    subtitle: string;
                };
                messages: {
                    acceptance: {
                        acc_01: {
                            text: string;
                            subText: string;
                        };
                        acc_02: {
                            text: string;
                            subText: string;
                        };
                        acc_03: {
                            text: string;
                            subText: string;
                        };
                    };
                    values: {
                        val_01: {
                            text: string;
                            subText: string;
                        };
                        val_02: {
                            text: string;
                            subText: string;
                        };
                    };
                    action: {
                        act_01: {
                            text: string;
                            subText: string;
                        };
                        act_02: {
                            text: string;
                            subText: string;
                        };
                        act_03: {
                            text: string;
                            subText: string;
                        };
                    };
                    rest: {
                        rest_01: {
                            text: string;
                            subText: string;
                        };
                        rest_02: {
                            text: string;
                            subText: string;
                        };
                    };
                };
            };
            readonly auth: {
                login: {
                    continueWithApple: string;
                    continueWithGoogle: string;
                    continueWithKakao: string;
                    termsAgreement: string;
                };
                error: {
                    tokenFailed: string;
                    unexpected: string;
                    logoutUnexpected: string;
                    googleAuthCanceled: string;
                    googleAuthCodeFailed: string;
                    googleAuthInfoFailed: string;
                    googleError: string;
                    kakaoFailed: string;
                    kakaoError: string;
                };
            };
            readonly onboard: {
                steps: {
                    step1: {
                        texts: string[];
                        button: string;
                    };
                    step2: {
                        texts: string[];
                        button: string;
                    };
                    step3: {
                        texts: string[];
                        button: string;
                    };
                    step4: {
                        texts: string[];
                        button: string;
                    };
                    step5: {
                        texts: string[];
                        button: string;
                    };
                    step6: {
                        texts: string[];
                        button: string;
                    };
                    step7: {
                        texts: string[];
                        button: string;
                    };
                    step8: {
                        texts: string[];
                        button: string;
                    };
                };
                breath: {
                    inhale: string;
                    hold: string;
                    exhale: string;
                };
            };
            readonly learning: {
                anxiety_info: {
                    title: string;
                    description: string;
                    analyticsKey: string;
                    steps: {
                        step1: {
                            title: string;
                            content: string[];
                        };
                        step2: {
                            title: string;
                            content: string[];
                        };
                        step3: {
                            title: string;
                            content: string[];
                        };
                        step4: {
                            title: string;
                            content: string[];
                        };
                        step5: {
                            title: string;
                            content: string[];
                        };
                    };
                };
                act_guide: {
                    title: string;
                    description: string;
                    analyticsKey: string;
                    steps: {
                        step1: {
                            title: string;
                            content: string[];
                        };
                        step2: {
                            title: string;
                            content: string[];
                        };
                        step3: {
                            title: string;
                            content: string[];
                        };
                        step4: {
                            title: string;
                            content: string[];
                        };
                        step5: {
                            title: string;
                            content: string[];
                        };
                    };
                };
            };
        };
    };
    readonly ko: {
        readonly translation: {
            readonly common: {
                button: {
                    start: string;
                    next: string;
                    prev: string;
                    complete: string;
                    back: string;
                    close: string;
                    restart: string;
                    send: string;
                    goHome: string;
                    confirm: string;
                };
                loading: string;
                error: {
                    generic: string;
                    occurred: string;
                    tryLater: string;
                    tryAgainLater: string;
                    loginRequired: string;
                    goToLogin: string;
                    pageNotFound: string;
                    cannotLoadScreen: string;
                };
                validation: {
                    charLimitExceeded: string;
                    charLimitMessage: string;
                };
                empty: {
                    noRecords: string;
                };
                example: string;
                or: string;
                writeYourOwn: string;
                settings: {
                    title: string;
                    user: {
                        name: string;
                        email: string;
                    };
                    language: string;
                    vibration: string;
                    feedback: {
                        title: string;
                        description: string;
                        placeholder: string;
                        send: string;
                    };
                    privacyPolicy: string;
                    termsOfService: string;
                    appVersion: string;
                    licenseInfo: string;
                    licenseDescription: string;
                    logout: string;
                };
            };
            readonly act: {
                readonly common: {
                    title: {
                        anchor: string;
                        diary: string;
                        detach: string;
                        embrace: string;
                        values: string;
                    };
                    history: {
                        title: string;
                        subtitle: string;
                        viewHistory: string;
                    };
                    historyType: {
                        contactWithPresent: string;
                        emotionNote: string;
                        cognitiveDefusion: string;
                        acceptance: string;
                        values: string;
                    };
                };
                readonly anchor: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                    };
                    step: {
                        step1: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        step2: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        step3: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        step4: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        step5: {
                            subject: string;
                            description: string[];
                            example: string;
                        };
                        hint: string;
                    };
                    result: {
                        title: string;
                        description: string[];
                    };
                    history: {
                        completed: string;
                    };
                };
                readonly diary: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                    };
                    step: {
                        step1: {
                            question: string;
                            description: string;
                            exampleBad: string;
                            exampleGood: string;
                        };
                        step2: {
                            question: string;
                            description: string;
                            exampleBad: string;
                            exampleGood: string;
                        };
                        step3: {
                            question: string;
                            description: string;
                        };
                        placeholder: string;
                    };
                    result: {
                        title: string;
                        description: string[];
                    };
                    history: {
                        situationQuestion: string;
                        thoughtQuestion: string;
                        emotionQuestion: string;
                    };
                };
                readonly detach: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                        button: string;
                    };
                    step: {
                        step1: {
                            title: string[];
                            description: string;
                            placeholder: string;
                        };
                        step2: {
                            title: string[];
                            description: string;
                        };
                    };
                    result: {
                        title: string[];
                        description: string[];
                    };
                    history: {
                        description: string;
                    };
                };
                readonly embrace: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                    };
                    step: {
                        startButton: string;
                        restartButton: string;
                    };
                    breath: {
                        inhale: string;
                        hold: string;
                        exhale: string;
                        completed: string;
                        restart: string;
                    };
                    result: {
                        title: string;
                        description: string[];
                        breathTime: string;
                    };
                    history: {
                        description: string;
                    };
                };
                readonly values: {
                    intro: {
                        title: string;
                        description: string[];
                        contentTitle: string;
                        contentDescription: string;
                        steps: string[];
                        tip: string;
                    };
                    step: {
                        step1: {
                            title: string;
                            description: string;
                        };
                        step2: {
                            title: string;
                            description: string;
                            placeholder: string;
                        };
                        step3: {
                            title: string;
                            description: string;
                            placeholder: string;
                        };
                        step4: {
                            title: string;
                            description: string;
                            placeholder: string;
                        };
                    };
                    domain: {
                        work: string;
                        leisure: string;
                        relationship: string;
                        growth: string;
                    };
                    result: {
                        title: string;
                        description: string[];
                        selectedDomain: string;
                        selectedValue: string;
                        orientation: string;
                        reason: string;
                        obstacle: string;
                        action: string;
                    };
                    history: {
                        title: string;
                        description: string;
                        matterQuestion: string;
                        valueQuestion: string;
                        barrierQuestion: string;
                        actionQuestion: string;
                    };
                };
            };
            readonly home: {
                greeting: string;
                menu: {
                    viewActHistory: string;
                    chatWithWind: string;
                    learning: string;
                    onboarding: string;
                    login: string;
                };
                app: {
                    name: string;
                    tagline: string;
                    description: string;
                };
                learning: {
                    title: string;
                    subtitle: string;
                };
                messages: {
                    acceptance: {
                        acc_01: {
                            text: string;
                            subText: string;
                        };
                        acc_02: {
                            text: string;
                            subText: string;
                        };
                        acc_03: {
                            text: string;
                            subText: string;
                        };
                    };
                    values: {
                        val_01: {
                            text: string;
                            subText: string;
                        };
                        val_02: {
                            text: string;
                            subText: string;
                        };
                    };
                    action: {
                        act_01: {
                            text: string;
                            subText: string;
                        };
                        act_02: {
                            text: string;
                            subText: string;
                        };
                        act_03: {
                            text: string;
                            subText: string;
                        };
                    };
                    rest: {
                        rest_01: {
                            text: string;
                            subText: string;
                        };
                        rest_02: {
                            text: string;
                            subText: string;
                        };
                    };
                };
            };
            readonly auth: {
                login: {
                    continueWithApple: string;
                    continueWithGoogle: string;
                    continueWithKakao: string;
                    termsAgreement: string;
                };
                error: {
                    tokenFailed: string;
                    unexpected: string;
                    logoutUnexpected: string;
                    googleAuthCanceled: string;
                    googleAuthCodeFailed: string;
                    googleAuthInfoFailed: string;
                    googleError: string;
                    kakaoFailed: string;
                    kakaoError: string;
                };
            };
            readonly onboard: {
                steps: {
                    step1: {
                        texts: string[];
                        button: string;
                    };
                    step2: {
                        texts: string[];
                        button: string;
                    };
                    step3: {
                        texts: string[];
                        button: string;
                    };
                    step4: {
                        texts: string[];
                        button: string;
                    };
                    step5: {
                        texts: string[];
                        button: string;
                    };
                    step6: {
                        texts: string[];
                        button: string;
                    };
                    step7: {
                        texts: string[];
                        button: string;
                    };
                    step8: {
                        texts: string[];
                        button: string;
                    };
                };
                breath: {
                    inhale: string;
                    hold: string;
                    exhale: string;
                };
            };
            readonly learning: {
                anxiety_info: {
                    title: string;
                    description: string;
                    analyticsKey: string;
                    steps: {
                        step1: {
                            title: string;
                            content: string[];
                        };
                        step2: {
                            title: string;
                            content: string[];
                        };
                        step3: {
                            title: string;
                            content: string[];
                        };
                        step4: {
                            title: string;
                            content: string[];
                        };
                        step5: {
                            title: string;
                            content: string[];
                        };
                    };
                };
                act_guide: {
                    title: string;
                    description: string;
                    analyticsKey: string;
                    steps: {
                        step1: {
                            title: string;
                            content: string[];
                        };
                        step2: {
                            title: string;
                            content: string[];
                        };
                        step3: {
                            title: string;
                            content: string[];
                        };
                        step4: {
                            title: string;
                            content: string[];
                        };
                        step5: {
                            title: string;
                            content: string[];
                        };
                    };
                };
            };
        };
    };
};
export default resources;
//# sourceMappingURL=index.d.ts.map