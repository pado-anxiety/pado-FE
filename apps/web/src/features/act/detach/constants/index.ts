import { DetachStep } from '../types';

export const DETACH_STEPS: DetachStep[] = [
  {
    id: 0,
    title: ['지금 머릿속을 떠다니는', '생각은 무엇인가요?'],
    description:
      '판단하지 않고 머릿속에 들리는 말을 그대로 옮겨 적어보세요. 길어도 괜찮고, 아주 사소한 문장이라도 좋습니다.',
  },
  {
    id: 1,
    title: ['이 문장 속 어디까지가', "내 머릿속 '생각'일까요?"],
    description: '해석이나 판단 부분만 드래그 해보세요.',
  },
];

export const STEP_COUNT = DETACH_STEPS.length;
