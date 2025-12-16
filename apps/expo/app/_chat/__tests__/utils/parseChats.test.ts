import { ROLE } from '../../constants';
import type { Chat } from '../../types';
import { parseChats } from '../../utils/parseChats';

describe('parseChats', () => {
  describe('Happy Path - Basic Functionality', () => {
    it('should return an empty array when given an empty array', () => {
      const result = parseChats([]);
      expect(result).toEqual([]);
    });

    it('should handle a single user message', () => {
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

    it('should handle a single AI message', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Hi there', time: '12:01' },
      ];
      
      const result = parseChats(chats);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        sender: ROLE.AI,
        messages: ['Hi there'],
        time: '12:01',
      });
    });

    it('should group consecutive AI messages together', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Hello', time: '12:00' },
        { sender: ROLE.AI, message: 'How are you?', time: '12:01' },
        { sender: ROLE.AI, message: 'I am here to help', time: '12:02' },
      ];
      
      const result = parseChats(chats);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        sender: ROLE.AI,
        messages: ['Hello', 'How are you?', 'I am here to help'],
        time: '12:00',
      });
    });

    it('should keep user messages separate', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Message 1', time: '12:00' },
        { sender: ROLE.USER, message: 'Message 2', time: '12:01' },
      ];
      
      const result = parseChats(chats);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        sender: ROLE.USER,
        message: 'Message 1',
        time: '12:00',
      });
      expect(result[1]).toEqual({
        sender: ROLE.USER,
        message: 'Message 2',
        time: '12:01',
      });
    });

    it('should separate AI message groups when interrupted by user messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'AI 1', time: '12:00' },
        { sender: ROLE.AI, message: 'AI 2', time: '12:01' },
        { sender: ROLE.USER, message: 'User 1', time: '12:02' },
        { sender: ROLE.AI, message: 'AI 3', time: '12:03' },
        { sender: ROLE.AI, message: 'AI 4', time: '12:04' },
      ];
      
      const result = parseChats(chats);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        sender: ROLE.AI,
        messages: ['AI 1', 'AI 2'],
        time: '12:00',
      });
      expect(result[1]).toEqual({
        sender: ROLE.USER,
        message: 'User 1',
        time: '12:02',
      });
      expect(result[2]).toEqual({
        sender: ROLE.AI,
        messages: ['AI 3', 'AI 4'],
        time: '12:03',
      });
    });
  });

  describe('Complex Scenarios', () => {
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

    it('should preserve correct message order within AI groups', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'First', time: '12:00' },
        { sender: ROLE.AI, message: 'Second', time: '12:01' },
        { sender: ROLE.AI, message: 'Third', time: '12:02' },
      ];
      
      const result = parseChats(chats);
      
      expect(result[0]).toEqual({
        sender: ROLE.AI,
        messages: ['First', 'Second', 'Third'],
        time: '12:00',
      });
    });

    it('should handle a realistic chat conversation', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Welcome!', time: '12:00' },
        { sender: ROLE.AI, message: 'How can I help?', time: '12:01' },
        { sender: ROLE.USER, message: 'I need help', time: '12:02' },
        { sender: ROLE.AI, message: 'Sure', time: '12:03' },
        { sender: ROLE.AI, message: 'What do you need?', time: '12:04' },
        { sender: ROLE.USER, message: 'Information about X', time: '12:05' },
      ];
      
      const result = parseChats(chats);
      
      expect(result).toHaveLength(4);
      
      // First AI group
      expect(result[0]).toEqual({
        sender: ROLE.AI,
        messages: ['Welcome!', 'How can I help?'],
        time: '12:00',
      });
      
      // User message
      expect(result[1]).toEqual({
        sender: ROLE.USER,
        message: 'I need help',
        time: '12:02',
      });
      
      // Second AI group
      expect(result[2]).toEqual({
        sender: ROLE.AI,
        messages: ['Sure', 'What do you need?'],
        time: '12:03',
      });
      
      // Second user message
      expect(result[3]).toEqual({
        sender: ROLE.USER,
        message: 'Information about X',
        time: '12:05',
      });
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
      expect(result[1]).toEqual({
        sender: ROLE.AI,
        messages: [''],
        time: '12:01',
      });
    });

    it('should handle messages with special characters', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: '!@#$%^&*()', time: '12:00' },
        { sender: ROLE.AI, message: '<script>alert("XSS")</script>', time: '12:01' },
      ];
      
      const result = parseChats(chats);
      
      expect(result[0].message).toBe('!@#$%^&*()');
      expect(result[1]).toMatchObject({
        sender: ROLE.AI,
        messages: ['<script>alert("XSS")</script>'],
      });
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(10000);
      const chats: Chat[] = [
        { sender: ROLE.USER, message: longMessage, time: '12:00' },
      ];
      
      const result = parseChats(chats);
      
      expect(result[0].message).toBe(longMessage);
      expect(result[0].message.length).toBe(10000);
    });

    it('should handle messages with newlines and whitespace', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Line 1\nLine 2\nLine 3', time: '12:00' },
        { sender: ROLE.AI, message: '   spaces   ', time: '12:01' },
      ];
      
      const result = parseChats(chats);
      
      expect(result[0].message).toBe('Line 1\nLine 2\nLine 3');
      expect(result[1]).toMatchObject({
        messages: ['   spaces   '],
      });
    });

    it('should handle messages with unicode characters', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: '😀😁😂🤣', time: '12:00' },
        { sender: ROLE.AI, message: '안녕하세요', time: '12:01' },
        { sender: ROLE.USER, message: '你好世界', time: '12:02' },
      ];
      
      const result = parseChats(chats);
      
      expect(result[0].message).toBe('😀😁😂🤣');
      expect(result[1]).toMatchObject({
        messages: ['안녕하세요'],
      });
      expect(result[2].message).toBe('你好世界');
    });

    it('should handle a large number of messages efficiently', () => {
      const chats: Chat[] = Array.from({ length: 1000 }, (_, i) => ({
        sender: i % 2 === 0 ? ROLE.USER : ROLE.AI,
        message: `Message ${i}`,
        time: `12:${i.toString().padStart(2, '0')}`,
      }));
      
      const startTime = performance.now();
      const result = parseChats(chats);
      const endTime = performance.now();
      
      // Should complete in reasonable time (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should preserve time property correctly for grouped messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'First', time: '12:00:00' },
        { sender: ROLE.AI, message: 'Second', time: '12:00:30' },
        { sender: ROLE.AI, message: 'Third', time: '12:01:00' },
      ];
      
      const result = parseChats(chats);
      
      // Should use the time of the first message in the group
      expect(result[0].time).toBe('12:00:00');
    });
  });

  describe('Message Order Preservation', () => {
    it('should maintain the correct order when messages are added in chronological order', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'A', time: '12:00' },
        { sender: ROLE.AI, message: 'B', time: '12:01' },
        { sender: ROLE.AI, message: 'C', time: '12:02' },
      ];
      
      const result = parseChats(chats);
      
      expect(result[0].messages).toEqual(['A', 'B', 'C']);
    });

    it('should handle reverse chronological order (as used in the app with inverted FlatList)', () => {
      // In the actual app, chats are added to the beginning of the array
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Latest', time: '12:03' },
        { sender: ROLE.AI, message: 'Middle', time: '12:02' },
        { sender: ROLE.AI, message: 'Oldest', time: '12:01' },
      ];
      
      const result = parseChats(chats);
      
      expect(result[0].messages).toEqual(['Latest', 'Middle', 'Oldest']);
    });
  });

  describe('Type Safety', () => {
    it('should correctly type USER messages as UserChat', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];
      
      const result = parseChats(chats);
      const userChat = result[0];
      
      expect(userChat.sender).toBe(ROLE.USER);
      // TypeScript should recognize this as UserChat with 'message' property
      expect('message' in userChat).toBe(true);
      expect('messages' in userChat).toBe(false);
    });

    it('should correctly type AI messages as AssistantChat', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Test', time: '12:00' },
      ];
      
      const result = parseChats(chats);
      const aiChat = result[0];
      
      expect(aiChat.sender).toBe(ROLE.AI);
      // TypeScript should recognize this as AssistantChat with 'messages' property
      expect('messages' in aiChat).toBe(true);
      expect('message' in aiChat).toBe(false);
    });
  });

  describe('Immutability', () => {
    it('should not modify the input array', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Test', time: '12:00' },
        { sender: ROLE.USER, message: 'Test 2', time: '12:01' },
      ];
      
      const originalChats = JSON.parse(JSON.stringify(chats));
      parseChats(chats);
      
      expect(chats).toEqual(originalChats);
    });

    it('should create new objects instead of mutating existing ones', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Test', time: '12:00' },
      ];
      
      const result = parseChats(chats);
      
      // Result should be a different object reference
      expect(result).not.toBe(chats);
    });
  });
});