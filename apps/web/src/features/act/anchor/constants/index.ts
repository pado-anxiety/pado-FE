import { Step } from '../types';

export const ANCHOR_STEPS: Step[] = [
  {
    id: 'step1',
    subject: '지금 보이는 5가지',
    count: 5,
    description: ['눈에 보이는 사물', '5가지를 찾아보세요'],
    example: '사물의 형태, 색상 등',
  },
  {
    id: 'step2',
    subject: '만질 수 있는 4가지',
    count: 4,
    description: ['몸에 닿는 감촉', '4가지에 집중해보세요'],
    example: '의자의 단단함, 옷의 질감 등',
  },
  {
    id: 'step3',
    subject: '들을 수 있는 3가지',
    count: 3,
    description: ['귀에 들리는 소리', '3가지를 들어보세요'],
    example: '먼 곳의 소음, 시계 초침 소리 등',
  },
  {
    id: 'step4',
    subject: '맡을 수 있는 2가지 냄새',
    count: 2,
    description: ['코끝을 스치는', '냄새 2가지를 맡아보세요'],
    example: '주변의 은은한 향기',
  },
  {
    id: 'step5',
    subject: '맛을 볼 수 있는 1가지',
    count: 1,
    description: ['좋아하는 맛을', '상상해도 좋아요'],
    example: '입안의 감촉 혹은 방금 마신 물의 여운',
  },
];
