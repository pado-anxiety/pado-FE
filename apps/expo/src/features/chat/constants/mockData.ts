import type { Chat } from '../types';
import { ROLE } from './const';

export const CHAT_MOCK_DATA: Chat[] = [
  {
    sender: ROLE.AI,
    message: '언제든 또 찾아와 줘',
    time: '12:08',
  },
  {
    sender: ROLE.AI,
    message: '오늘 밤은 푹 자길 바랄게',
    time: '12:08',
  },
  {
    sender: ROLE.USER,
    message: '고마워, 덕분에 마음이 좀 편해졌어.',
    time: '12:07',
  },
  {
    sender: ROLE.AI,
    message: '정말 멋진 생각이야',
    time: '12:06',
  },
  {
    sender: ROLE.AI,
    message: '너는 충분히 용기 있는 사람이야',
    time: '12:06',
  },
  {
    sender: ROLE.AI,
    message: '거절당해도 네 잘못이 아니야',
    time: '12:06',
  },
  {
    sender: ROLE.AI,
    message: '천천히 다가가도 괜찮아',
    time: '12:06',
  },
  {
    sender: ROLE.USER,
    message:
      '내일 학교 가서 내가 먼저 말을 걸어볼게. 받아줄지 모르겠지만 용기내볼게.',
    time: '12:05',
  },
  {
    sender: ROLE.AI,
    message: '그리고 나서 친구들과 다시 얘기해보는건 어때?',
    time: '12:04',
  },
  {
    sender: ROLE.AI,
    message: '일단 숨을 깊게 쉬고 마음을 가라앉혀봐',
    time: '12:04',
  },
  {
    sender: ROLE.AI,
    message: '그랬구나',
    time: '12:04',
  },
  {
    sender: ROLE.USER,
    message:
      '학교에서 친구들과 싸웠어. 그런데 나는 친구들을 미워해. 어떻게 해야할까? 나는 다시 화해하고 싶어. 근데 너무 불안하고 화가 나',
    time: '12:03',
  },
  {
    sender: ROLE.AI,
    message: '지금 감정이 어떤지 나에게 알려줘',
    time: '12:02',
  },
  {
    sender: ROLE.AI,
    message: '오늘은 무슨 일이 있었어?',
    time: '12:01',
  },
  {
    sender: ROLE.AI,
    message: '안녕 나는 냥토닥이야',
    time: '12:00',
  },
];
