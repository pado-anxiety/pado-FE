import type { Step } from '../types';

export const steps: Step[] = [
  {
    texts: ["안녕하세요. 마음의 물결을 마주하는 곳, '파도'입니다."],
    buttonText: '반가워요!',
  },
  {
    texts: ['일상 속 불안 때문에', ' 숨이 가쁘거나 마음이 무거우신가요?'],
    buttonText: '네',
  },
  {
    texts: ['불안에 갇혀', ' 지금 이 순간을 놓치고 있지는 않나요?'],
    buttonText: '네',
  },
  {
    texts: [
      '수용전념치료(ACT)는 말합니다.',
      '불안은 극복의 대상이 아니라,',
      '그저 흘려보내는 것이라고요.',
    ],
    buttonText: '어떻게 흘려보낼 수 있나요?',
  },
  {
    texts: [
      "그래서 '파도'는 우리 마음속 불안을 잠시 머물다 가는 '파도'에 비유했습니다.",
      '그리고 그 파도가 바다의 일부인 것처럼,',
      '우리의 마음 또한 그 파도를 품고 있는 깊고 넓은 바다입니다.',
    ],
    buttonText: '이해했어요',
  },
  {
    texts: ["이제 '파도'와 함께 마음의 바다를 더 넓게 넓혀봐요"],
    buttonText: '좋아요',
  },
  {
    texts: [
      '간단하게 4-7-8 호흡법만 연습해볼게요.',
      '4초 동안 숨을 깊게 들이고,',
      '7초 동안 숨을 멈추고,',
      '8초 동안 숨을 천천히 내쉬어요.',
      '시작하기에 앞서 마음을 진정하는데 도움이 될 거에요.',
    ],
    buttonText: '시작해봐요!',
  },
  {
    texts: [
      '잘하셨어요. 마음이 한결 편안해지셨나요?',
      "이제 '파도'와 함께 마음의 바다를 더 넓혀봐요'",
    ],
    buttonText: '시작하기',
  },
];

export const FADE_IN_DURATION = 0.6;
export const FADE_OUT_DURATION = 0.4;
export const TEXT_DELAY = 0.6;
export const BUTTON_DELAY = 0.8;

export const BREATH_CYCLE_COUNT = 2;
export const BREATH_TIMING = {
  INHALE: 4,
  HOLD: 7,
  EXHALE: 8,
} as const;

export const BREATH_TEXTS = {
  INHALE: '숨을 깊게 들이마셔요',
  HOLD: '숨을 멈춘 채 잠시 기다려요',
  EXHALE: '천천히 숨을 내쉬어요',
} as const;

export const WAVE_CONFIG = {
  AMPLITUDE: 25,
  GAP_NORMAL: 35,
  GAP_COMPRESSED: 20,
  BASE_Y_RATIO: 0.2,
  TIME_INCREMENT: 0.015,
  WAVE_STEP: 4,
} as const;

export const WAVE_CONFIGS = [
  {
    color: '#D3F3FF',
    frequency: 1.5,
    speedMultiplier: 1.2,
    offsetRatio: -0.18,
  },
  { color: '#77AADD', frequency: 1.5, speedMultiplier: 1, offsetRatio: -0.15 },
  {
    color: '#3388CC',
    frequency: 1.5,
    speedMultiplier: 0.8,
    offsetRatio: -0.13,
  },
  { color: '#005599', frequency: 1.5, speedMultiplier: 1, offsetRatio: -0.09 },
  {
    color: '#003366',
    frequency: 1.5,
    speedMultiplier: 1.2,
    offsetRatio: -0.05,
  },
] as const;

export const GRADIENT_END_COLOR = '#000814';
export const BREATHING_STEP_INDEX = 6;
