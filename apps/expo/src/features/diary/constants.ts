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

export const SITUATION_CHIP_KEYS = [
  'atWork',
  'atHome',
  'inConversation',
  'alone',
  'browsingSns',
] as const;

export const THOUGHT_CHIP_KEYS = [
  'cantDoWell',
  'onlyMe',
  'dontKnow',
  'messedUp',
] as const;

export const BASIC_EMOTIONS: EmotionItem[] = [
  { emoji: '😰', label: 'anxious' },
  { emoji: '😨', label: 'scared' },
  { emoji: '😢', label: 'sad' },
  { emoji: '😤', label: 'angry' },
  { emoji: '😮‍💨', label: 'exhausted' },
  { emoji: '🫥', label: 'empty' },
  { emoji: '😳', label: 'ashamed' },
  { emoji: '🥺', label: 'lonely' },
];

export const EMOTION_CATEGORIES: EmotionCategory[] = [
  {
    label: 'tensionPressure',
    emotions: [
      { emoji: '😬', label: 'nervous' },
      { emoji: '😵', label: 'restless' },
      { emoji: '🫠', label: 'pressured' },
      { emoji: '🤭', label: 'onEdge' },
    ],
  },
  {
    label: 'sadnessLoss',
    emotions: [
      { emoji: '😞', label: 'depressed' },
      { emoji: '😑', label: 'deflated' },
      { emoji: '🥲', label: 'nostalgic' },
      { emoji: '😔', label: 'disappointed' },
      { emoji: '😣', label: 'regretful' },
    ],
  },
  {
    label: 'angerFrustration',
    emotions: [
      { emoji: '😠', label: 'irritated' },
      { emoji: '😒', label: 'resentful' },
      { emoji: '😫', label: 'frustrated' },
      { emoji: '🤬', label: 'betrayed' },
    ],
  },
  {
    label: 'selfDoubtShame',
    emotions: [
      { emoji: '😶', label: 'incompetent' },
      { emoji: '🫣', label: 'embarrassed' },
      { emoji: '😤', label: 'jealous' },
      { emoji: '😓', label: 'guilty' },
    ],
  },
  {
    label: 'numbnessConfusion',
    emotions: [
      { emoji: '😶‍🌫️', label: 'dazed' },
      { emoji: '😵‍💫', label: 'confused' },
      { emoji: '🛌', label: 'lethargic' },
      { emoji: '🤯', label: 'suffocated' },
    ],
  },
];

export const STEP_IDS = ['situation', 'thought', 'emotion'] as const;

export const DIARY_FUNNEL_STEPS: FunnelStep<
  DiaryFunnelContext,
  DiaryStepId
>[] = [
  { id: 'situation' },
  { id: 'thought' },
  { id: 'emotion' },
];
