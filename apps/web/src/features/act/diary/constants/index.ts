import { DiaryStep } from '../types';

export const DIARY_STEPS: DiaryStep[] = [
  {
    id: 1,
    question: '어떤 상황이 있었나요?',
    description:
      '감정이 흔들렸던 순간의 사실을 CCTV가 찍듯이 객관적으로 적어보세요.',
    example: {
      bad: 'X: 친구가 나를 무시해서 연락이 없었다.',
      good: 'O: 친구에게 보낸 메시지에 3시간 동안 답장이 없었다.',
    },
  },
  {
    id: 2,
    question: '어떤 생각이 스쳤나요?',
    description:
      '사실에 덧붙여진 나의 해석이나 스쳐 지나간 생각들을 그대로 적어보세요.',
    example: {
      bad: 'X: 짜증 나고 화가 났다. (이건 감정이에요)',
      good: 'O: "나를 싫어하나?", "내가 실수했나?"라는 생각이 들었다.',
    },
  },
  {
    id: 3,
    question: '어떤 감정을 느꼈나요?',
    description:
      '그 생각으로 인해 찾아온 감정이나 신체 감각을 선택하거나 작성해보세요.',
    example: {
      bad: '',
      good: '',
    },
  },
];

export const STEP_COUNT = DIARY_STEPS.length;
