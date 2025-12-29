import { Step } from '../types';

export const ANCHOR_STEPS: Step[] = [
  {
    id: 'step1',
    subject: '지금 보이는 5가지',
    description: ['주위에 있는 물건', '5가지를 찾아보세요'],
    example: '책상 위에 놓인 책',
    count: 5,
  },
  {
    id: 'step2',
    subject: '만질 수 있는 4가지',
    example: '얼음물이 담긴 물컵',
    description: ['4가지 물체의 온도와', '질감을 느껴보세요'],
    count: 4,
  },
  {
    id: 'step3',
    subject: '들을 수 있는 3가지',
    example: '새 소리',
    description: ['소리에 집중하여', '주변의 소리 3가지를 들어보세요'],
    count: 3,
  },
  {
    id: 'step4',
    subject: '맡을 수 있는 2가지 냄새',
    example: '향수 냄새',
    description: ['주위에 있는 것들에서', '2가지 냄새를 맡아보세요'],
    count: 2,
  },
  {
    id: 'step5',
    subject: '맛을 볼 수 있는 1가지',
    example: '지금 맛을 볼 수 없다면, 좋아하는 맛을 상상해도 좋아요',
    description: ['지금 맛을 볼 수 없다면,', '좋아하는 맛을 상상해도 좋아요'],
    count: 1,
  },
];
