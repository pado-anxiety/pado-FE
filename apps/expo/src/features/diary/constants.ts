import type { FunnelStep } from '@src/hooks/useFunnel';

import type {
  DiaryFunnelContext,
  DiaryStepId,
  EmotionCategory,
  EmotionItem,
} from './types';

export const MAX_CHAR_LIMIT = 200;
export const STEP_COUNT = 3;
export const DEFAULT_INTENSITY = 5;

export const SITUATION_CHIPS = [
  '직장에서',
  '집에서',
  '대화 중에',
  '혼자 있을 때',
  'SNS를 보다가',
] as const;

export const THOUGHT_CHIPS = [
  '잘 못할 것 같아',
  '나만 이런 것 같아',
  '어쩌지 모르겠어',
  '또 망했어',
] as const;

export const BASIC_EMOTIONS: EmotionItem[] = [
  { emoji: '😰', label: '불안한' },
  { emoji: '😨', label: '두려운' },
  { emoji: '😢', label: '슬픈' },
  { emoji: '😤', label: '화가 난' },
  { emoji: '😮‍💨', label: '지친' },
  { emoji: '🫥', label: '공허한' },
  { emoji: '😳', label: '수치스러운' },
  { emoji: '🥺', label: '외로운' },
];

export const EMOTION_CATEGORIES: EmotionCategory[] = [
  {
    label: '긴장·압박',
    emotions: [
      { emoji: '😬', label: '긴장된' },
      { emoji: '😵', label: '초조한' },
      { emoji: '🫠', label: '압박감' },
      { emoji: '🤭', label: '조마조마한' },
    ],
  },
  {
    label: '슬픔·상실',
    emotions: [
      { emoji: '😞', label: '우울한' },
      { emoji: '😑', label: '허탈한' },
      { emoji: '🥲', label: '그리운' },
      { emoji: '😔', label: '실망한' },
      { emoji: '😣', label: '후회되는' },
    ],
  },
  {
    label: '분노·좌절',
    emotions: [
      { emoji: '😠', label: '짜증나는' },
      { emoji: '😒', label: '억울한' },
      { emoji: '😫', label: '좌절스러운' },
      { emoji: '🤬', label: '배신감' },
    ],
  },
  {
    label: '자기 의심·수치',
    emotions: [
      { emoji: '😶', label: '무능한 것 같은' },
      { emoji: '🫣', label: '창피한' },
      { emoji: '😤', label: '질투나는' },
      { emoji: '😓', label: '죄책감' },
    ],
  },
  {
    label: '무감각·혼란',
    emotions: [
      { emoji: '😶‍🌫️', label: '멍한' },
      { emoji: '😵‍💫', label: '혼란스러운' },
      { emoji: '🛌', label: '무기력한' },
      { emoji: '🤯', label: '답답한' },
    ],
  },
];

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const STEP_LABELS = ['상황', '생각', '감정'] as const;
export const STEP_BUTTON_LABELS = [
  '상황 기록하기',
  '생각 기록하기',
  '감정 완료하기',
] as const;

export const DIARY_FUNNEL_STEPS: FunnelStep<
  DiaryFunnelContext,
  DiaryStepId
>[] = [
  { id: 'situation' },
  { id: 'thought' },
  { id: 'emotion' },
];
