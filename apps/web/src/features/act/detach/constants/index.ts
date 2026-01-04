import { DetachStep } from '../types';

export const DETACH_STEPS: DetachStep[] = [
  {
    id: 0,
    title: '무엇 때문에 불안을 느끼나요?',
    description:
      '불안을 만드는 문장을 있는 그대로 적어보세요. 길어도 괜찮고, 자유롭게 적어도 좋아요.',
  },
  {
    id: 1,
    title: '적은 문장에서 생각을 구분해보세요',
    description: '사실이 아닌 나의 생각 부분을 터치 또는 드래그 해보세요',
  },
];

export const STEP_COUNT = DETACH_STEPS.length;
