import { ROLE } from '../constants';
import { CBTRecommendation } from './chat-api';
import { CHAT_TYPE } from './chat-type';

/** 사용자 채팅 UI */
export interface UserChatUI {
  type: typeof CHAT_TYPE.CHAT;
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

/** CBT 추천 채팅 UI, 메시지 */
export interface CBTRecommendChatUI {
  type: typeof CHAT_TYPE.CHAT;
  sender: typeof ROLE.SYSTEM;
  messages: string[];
  time: string;
}

/** CBT 추천 채팅 UI */
export type CBTRecommendationChatUI = CBTRecommendChatUI | CBTRecommendation;

export type ChatUI =
  | UserChatUI
  | AssistantChatUI
  | CBTRecommendChatUI
  | CBTRecommendation;
