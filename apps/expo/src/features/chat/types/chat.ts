import { ROLE } from '../constants';
import { CHAT_TYPE } from './chat-type';

/** 채팅 발신자 타입 */
export type ChatSender = keyof typeof ROLE;

/** 채팅 종류 */
export type ChatType = keyof typeof CHAT_TYPE;

/** 채팅 api */
export interface Chat {
  type: ChatType;
  sender: ChatSender;
  message: string;
  time: string;
}

/** CBT 추천 api */
export interface CBTRecommendationChat {
  type: typeof CHAT_TYPE.CBT_RECOMMENDATION;
  options: {
    symptom: string; // BODY | MIND
    intensity: number; // 1 ~ 5
    situation: string; // PRESENTATION_EXAM | TEST | ...
  };
  time: string;
}

/** 사용자 채팅 UI */
export interface UserChatUI {
  type: ChatType;
  sender: typeof ROLE.USER;
  message: string;
  time: string;
}

/** AI 어시스턴트 채팅 UI, 메시지 */
export interface AssistantChatUI {
  type: typeof CHAT_TYPE.CHAT;
  sender: typeof ROLE.AI;
  messages: string[];
  time: string;
}

/** CBT 추천 UI */
export type CBTRecommendationChatUI = CBTRecommendationChat;

export type ChatAPI = (Chat | CBTRecommendationChat)[];

/** 파싱된 UI 채팅 */
export type ChatUI = UserChatUI | AssistantChatUI | CBTRecommendationChatUI;
