import { ROLE } from '../constants';
import type { AssistantChat, Chat, ParsedChat, UserChat } from '../types';

export function parseChats(chats: Chat[]): ParsedChat[] {
  const stack: ParsedChat[] = [];

  for (const chat of chats) {
    if (chat.sender === ROLE.USER) {
      stack.push(chat as UserChat);
      continue;
    }

    const lastItem = stack[stack.length - 1];
    if (!lastItem || lastItem.sender === ROLE.USER) {
      stack.push({
        sender: ROLE.AI,
        messages: [chat.message],
        time: chat.time,
      });
      continue;
    }

    const lastAssistant = lastItem as AssistantChat;
    lastAssistant.messages.unshift(chat.message);
  }

  return stack;
}
