import { ROLE } from '../constants';
import type {
  CBTRecommendChat,
  ChatAPI,
  ChatAssistantAPI,
  ChatUI,
} from '../types';
import { CHAT_TYPE } from '../types/chat-type';

const splitMessage = (message: string | undefined | null): string[] => {
  if (!message) return [];
  return message.split(/(?<=[!?.])\s*/);
};

export const parseChats = (chats: ChatAPI): ChatUI[] => {
  const stack: ChatUI[] = [];

  for (const chat of chats) {
    if (chat.type === CHAT_TYPE.CHAT && chat.sender === ROLE.AI) {
      stack.push({
        ...chat,
        messages: splitMessage((chat as ChatAssistantAPI).message),
      });
      continue;
    }

    if (chat.type === CHAT_TYPE.CHAT && chat.sender === ROLE.SYSTEM) {
      stack.push({
        ...chat,
        messages: splitMessage((chat as CBTRecommendChat).message),
      });
      continue;
    }

    stack.push(chat as ChatUI);
  }

  return stack;
};
