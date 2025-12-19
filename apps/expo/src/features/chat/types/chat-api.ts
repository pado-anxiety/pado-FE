import { ROLE } from '../constants';
import { CHAT_TYPE } from './chat-type';

/** 채팅 발신자 타입 */
export type ChatSender = keyof typeof ROLE;

/** 채팅 종류 */
export type ChatType = keyof typeof CHAT_TYPE;

export interface ChatUserAPI {
  type: typeof CHAT_TYPE.CHAT;
  sender: typeof ROLE.USER;
  message: string;
  time: string;
}

export interface ChatAssistantAPI {
  type: typeof CHAT_TYPE.CHAT;
  sender: typeof ROLE.AI;
  message: string;
  time: string;
}

export interface CBTRecommendation {
  type: typeof CHAT_TYPE.CBT_RECOMMENDATION;
  options: {
    symptom: string; // BODY | MIND
    intensity: number; // 1 ~ 5
    situation: string; // PRESENTATION_EXAM | TEST | ...
  };
  time: string;
}

export interface CBTRecommendChat {
  type: typeof CHAT_TYPE.CHAT;
  sender: typeof ROLE.SYSTEM;
  message: string;
  time: string;
}

/** CBT 추천 채팅 api */
export interface CBTRecommendationAPI {
  content: (CBTRecommendation | CBTRecommendChat)[];
  cbt: 'BREATHING' | 'CALMING_PHRASE' | 'GROUNDING' | 'COGNITIVE_REFRAME';
}

/** 채팅 기록 api */
export type ChatAPI = (
  | ChatUserAPI
  | ChatAssistantAPI
  | CBTRecommendation
  | CBTRecommendChat
)[];
