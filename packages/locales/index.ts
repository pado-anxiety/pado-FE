// English
import enCommon from './en/common.json';
import enActCommon from './en/act/common.json';
import enActAnchor from './en/act/anchor.json';
import enActDiary from './en/act/diary.json';
import enActDetach from './en/act/detach.json';
import enActEmbrace from './en/act/embrace.json';
import enActValues from './en/act/values.json';
import enHome from './en/home.json';
import enAuth from './en/auth.json';
import enOnboard from './en/onboard.json';

// Korean
import koCommon from './ko/common.json';
import koActCommon from './ko/act/common.json';
import koActAnchor from './ko/act/anchor.json';
import koActDiary from './ko/act/diary.json';
import koActDetach from './ko/act/detach.json';
import koActEmbrace from './ko/act/embrace.json';
import koActValues from './ko/act/values.json';
import koHome from './ko/home.json';
import koAuth from './ko/auth.json';
import koOnboard from './ko/onboard.json';

const resources = {
    en: {
        translation: {
            common: enCommon,
            act: {
                common: enActCommon,
                anchor: enActAnchor,
                diary: enActDiary,
                detach: enActDetach,
                embrace: enActEmbrace,
                values: enActValues,
            },
            home: enHome,
            auth: enAuth,
            onboard: enOnboard,
        },
    },
    ko: {
        translation: {
            common: koCommon,
            act: {
                common: koActCommon,
                anchor: koActAnchor,
                diary: koActDiary,
                detach: koActDetach,
                embrace: koActEmbrace,
                values: koActValues,
            },
            home: koHome,
            auth: koAuth,
            onboard: koOnboard,
        },
    },
} as const;

export default resources;
