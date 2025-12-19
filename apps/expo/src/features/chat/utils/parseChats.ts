import { ROLE } from '../constants';
import type {
  CBTRecommendChat,
  ChatAPI,
  ChatAssistantAPI,
  ChatUI,
} from '../types';
import { CHAT_TYPE } from '../types/chat-type';

export const parseChats = (chats: ChatAPI): ChatUI[] => {
  const stack: ChatUI[] = [];

  for (const chat of chats) {
    if (chat.type === CHAT_TYPE.CHAT && chat.sender === ROLE.AI) {
      const messages = (chat as ChatAssistantAPI).message.split(
        /(?<=[!?.])\s*/,
      );
      stack.push({
        ...chat,
        messages,
      });
      continue;
    }

    if (chat.type === CHAT_TYPE.CHAT && chat.sender === ROLE.SYSTEM) {
      const messages = (chat as CBTRecommendChat).message.split(
        /(?<=[!?.])\s*/,
      );
      stack.push({
        ...chat,
        messages,
      });
      continue;
    }

    stack.push(chat as ChatUI);
  }

  return stack;
};
