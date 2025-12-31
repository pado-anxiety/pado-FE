import { DiaryStep } from '../types';

export const DIARY_STEPS: DiaryStep[] = [
  {
    id: 1,
    question: '어떤 상황이 있었나요?',
    description: '감정이 흔들렸던 순간의 사실을 객관적으로 작성해보세요.',
    example: {
      bad: '팀장님이 무례하게 굴어서 기분이 안좋았다. (X)',
      good: '팀장님이 내 보고서를 던졌다. (O)',
    },
  },
  {
    id: 2,
    question: '그 상황에서 어떤 생각이 스쳤나요?',
    description:
      '그 상황에서 내 머리속을 스쳐 지나간 생각들을 그대로 적습니다. 판단하지 않고 그대로 적어보세요.',
    example: {
      bad: '그냥 팀장님이 무례하게 굴어서 기분이 안좋았다. (X)',
      good: '그냥 팀장님이 무례하게 굴었다고 생각했다. (O)',
    },
  },
  {
    id: 3,
    question: '그 생각 때문에 어떤 느낌이 들었나요?',
    description: "내 몸과 마음에서 어떤 '느낌'이 들었는지 적어봅니다.",
    example: {
      bad: '태그',
      good: '태그',
    },
  },
];

export const STEP_COUNT = DIARY_STEPS.length;
