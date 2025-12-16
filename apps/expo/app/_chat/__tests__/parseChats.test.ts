import { ROLE } from '../constants';
import type { Chat } from '../types';
import { parseChats } from '../utils/parseChats';

describe('parseChats', () => {
  describe('Basic Functionality', () => {
    it('should return empty array when given empty array', () => {
      const result = parseChats([]);
      expect(result).toEqual([]);
    });

    it('should handle single user message', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Hello', time: '12:00' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        sender: ROLE.USER,
        message: 'Hello',
        time: '12:00',
      });
    });

    it('should handle single AI message', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Hi there', time: '12:00' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        sender: ROLE.AI,
        messages: ['Hi there'],
        time: '12:00',
      });
    });
  });

  describe('Message Grouping', () => {
    it('should group consecutive AI messages together', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Message 1', time: '12:00' },
        { sender: ROLE.AI, message: 'Message 2', time: '12:01' },
        { sender: ROLE.AI, message: 'Message 3', time: '12:02' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        sender: ROLE.AI,
        messages: ['Message 1', 'Message 2', 'Message 3'],
        time: '12:00',
      });
    });

    it('should preserve message order within AI group (first message first)', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'First', time: '12:00' },
        { sender: ROLE.AI, message: 'Second', time: '12:01' },
        { sender: ROLE.AI, message: 'Third', time: '12:02' },
      ];
      const result = parseChats(chats);
      
      expect(result[0].sender).toBe(ROLE.AI);
      if (result[0].sender === ROLE.AI) {
        expect(result[0].messages).toEqual(['First', 'Second', 'Third']);
      }
    });

    it('should not group AI messages separated by user message', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'AI 1', time: '12:00' },
        { sender: ROLE.AI, message: 'AI 2', time: '12:01' },
        { sender: ROLE.USER, message: 'User', time: '12:02' },
        { sender: ROLE.AI, message: 'AI 3', time: '12:03' },
        { sender: ROLE.AI, message: 'AI 4', time: '12:04' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(3);
      expect(result[0].sender).toBe(ROLE.AI);
      expect(result[1].sender).toBe(ROLE.USER);
      expect(result[2].sender).toBe(ROLE.AI);
      
      if (result[0].sender === ROLE.AI) {
        expect(result[0].messages).toEqual(['AI 1', 'AI 2']);
      }
      if (result[2].sender === ROLE.AI) {
        expect(result[2].messages).toEqual(['AI 3', 'AI 4']);
      }
    });
  });

  describe('Mixed Message Patterns', () => {
    it('should handle alternating user and AI messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'User 1', time: '12:00' },
        { sender: ROLE.AI, message: 'AI 1', time: '12:01' },
        { sender: ROLE.USER, message: 'User 2', time: '12:02' },
        { sender: ROLE.AI, message: 'AI 2', time: '12:03' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(4);
      expect(result[0].sender).toBe(ROLE.USER);
      expect(result[1].sender).toBe(ROLE.AI);
      expect(result[2].sender).toBe(ROLE.USER);
      expect(result[3].sender).toBe(ROLE.AI);
    });

    it('should handle multiple user messages in a row', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'User 1', time: '12:00' },
        { sender: ROLE.USER, message: 'User 2', time: '12:01' },
        { sender: ROLE.USER, message: 'User 3', time: '12:02' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(3);
      result.forEach((chat) => {
        expect(chat.sender).toBe(ROLE.USER);
      });
    });

    it('should handle complex conversation pattern', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'AI 1', time: '12:00' },
        { sender: ROLE.AI, message: 'AI 2', time: '12:01' },
        { sender: ROLE.USER, message: 'User 1', time: '12:02' },
        { sender: ROLE.AI, message: 'AI 3', time: '12:03' },
        { sender: ROLE.USER, message: 'User 2', time: '12:04' },
        { sender: ROLE.USER, message: 'User 3', time: '12:05' },
        { sender: ROLE.AI, message: 'AI 4', time: '12:06' },
        { sender: ROLE.AI, message: 'AI 5', time: '12:07' },
        { sender: ROLE.AI, message: 'AI 6', time: '12:08' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(6);
      
      // First group: AI messages
      expect(result[0].sender).toBe(ROLE.AI);
      if (result[0].sender === ROLE.AI) {
        expect(result[0].messages).toHaveLength(2);
      }
      
      // User message
      expect(result[1].sender).toBe(ROLE.USER);
      
      // Single AI message
      expect(result[2].sender).toBe(ROLE.AI);
      if (result[2].sender === ROLE.AI) {
        expect(result[2].messages).toHaveLength(1);
      }
      
      // Two user messages
      expect(result[3].sender).toBe(ROLE.USER);
      expect(result[4].sender).toBe(ROLE.USER);
      
      // Final AI group
      expect(result[5].sender).toBe(ROLE.AI);
      if (result[5].sender === ROLE.AI) {
        expect(result[5].messages).toHaveLength(3);
      }
    });
  });

  describe('Time Preservation', () => {
    it('should preserve time of first message in AI group', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'First', time: '12:00' },
        { sender: ROLE.AI, message: 'Second', time: '12:05' },
        { sender: ROLE.AI, message: 'Third', time: '12:10' },
      ];
      const result = parseChats(chats);
      
      expect(result[0].time).toBe('12:00');
    });

    it('should preserve time for user messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Hello', time: '12:30' },
      ];
      const result = parseChats(chats);
      
      expect(result[0].time).toBe('12:30');
    });
  });

  describe('Edge Cases', () => {
    it('should handle messages with empty strings', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: '', time: '12:00' },
        { sender: ROLE.AI, message: '', time: '12:01' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        sender: ROLE.USER,
        message: '',
        time: '12:00',
      });
    });

    it('should handle messages with special characters', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: '!@#$%^&*()', time: '12:00' },
        { sender: ROLE.AI, message: '<script>alert("test")</script>', time: '12:01' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(2);
      if (result[0].sender === ROLE.USER) {
        expect(result[0].message).toBe('!@#$%^&*()');
      }
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(10000);
      const chats: Chat[] = [
        { sender: ROLE.USER, message: longMessage, time: '12:00' },
      ];
      const result = parseChats(chats);
      
      expect(result[0]).toEqual({
        sender: ROLE.USER,
        message: longMessage,
        time: '12:00',
      });
    });

    it('should handle unicode characters', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: '안녕하세요 😊', time: '12:00' },
        { sender: ROLE.AI, message: 'こんにちは 🎌', time: '12:01' },
      ];
      const result = parseChats(chats);
      
      expect(result).toHaveLength(2);
      if (result[0].sender === ROLE.USER) {
        expect(result[0].message).toBe('안녕하세요 😊');
      }
    });

    it('should handle large number of messages', () => {
      const chats: Chat[] = Array.from({ length: 1000 }, (_, i) => ({
        sender: i % 2 === 0 ? ROLE.USER : ROLE.AI,
        message: `Message ${i}`,
        time: `12:${i.toString().padStart(2, '0')}`,
      }));
      
      const result = parseChats(chats);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should correctly parse mock data pattern', () => {
      // Simulating the pattern from CHAT_MOCK_DATA
      const chats: Chat[] = [
        { sender: ROLE.AI, message: '언제든 또 찾아와 줘', time: '12:08' },
        { sender: ROLE.AI, message: '오늘 밤은 푹 자길 바랄게', time: '12:08' },
        { sender: ROLE.USER, message: '고마워, 덕분에 마음이 좀 편해졌어.', time: '12:07' },
        { sender: ROLE.AI, message: '정말 멋진 생각이야', time: '12:06' },
      ];
      
      const result = parseChats(chats);
      
      expect(result).toHaveLength(3);
      
      // First two AI messages should be grouped
      expect(result[0].sender).toBe(ROLE.AI);
      if (result[0].sender === ROLE.AI) {
        expect(result[0].messages).toHaveLength(2);
      }
      
      // User message
      expect(result[1].sender).toBe(ROLE.USER);
      
      // Single AI message
      expect(result[2].sender).toBe(ROLE.AI);
      if (result[2].sender === ROLE.AI) {
        expect(result[2].messages).toHaveLength(1);
      }
    });
  });

  describe('Type Safety', () => {
    it('should maintain type information for user chats', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];
      const result = parseChats(chats);
      
      expect(result[0].sender).toBe(ROLE.USER);
      if (result[0].sender === ROLE.USER) {
        expect(typeof result[0].message).toBe('string');
        expect('messages' in result[0]).toBe(false);
      }
    });

    it('should maintain type information for AI chats', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Test', time: '12:00' },
      ];
      const result = parseChats(chats);
      
      expect(result[0].sender).toBe(ROLE.AI);
      if (result[0].sender === ROLE.AI) {
        expect(Array.isArray(result[0].messages)).toBe(true);
        expect('message' in result[0]).toBe(false);
      }
    });
  });
});