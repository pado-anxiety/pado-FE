import { ROLE } from '../constants';
import { CHAT_TYPE } from './chat-type';

/** 채팅 발신자 타입 */
export type ChatSender = keyof typeof ROLE;

/** 기본 채팅 메시지 타입 */
export interface Chat {
  type: keyof typeof CHAT_TYPE;
  sender: ChatSender;
  message: string;
  time: string;
}

/** 사용자 채팅 UI 메시지 타입 */
export interface UserChat {
  type: typeof CHAT_TYPE.CHAT;
  sender: typeof ROLE.USER;
  message: string;
  time: string;
}

/** AI 어시스턴트 채팅 UI 메시지 타입 (그룹화된 메시지) */
export interface AssistantChat {
  type: typeof CHAT_TYPE.CHAT;
  sender: typeof ROLE.AI;
  messages: string[];
  time: string;
}

/** CBT 추천 타입 */
export interface CBTRecommendationChat {
  type: typeof CHAT_TYPE.CBT_RECOMMENDATION;
  options: {
    symptom: string; // BODY | MIND
    intensity: number; // 1 ~ 5
    situation: string; // PRESENTATION_EXAM | TEST | ...
  };
  time: string;
}

/** 파싱된 UI 채팅 타입 (UserChat 또는 AssistantChat) */
export type ParsedChat = UserChat | AssistantChat;
