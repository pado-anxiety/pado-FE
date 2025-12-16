import React from 'react';
import { render } from '@testing-library/react-native';
import UserChatBox from '../UserChatBox';
import { ROLE } from '../../../constants';

describe('UserChatBox', () => {
  const mockChat = {
    sender: ROLE.USER as typeof ROLE.USER,
    message: 'Hello, this is a test message',
    time: '12:00',
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<UserChatBox chat={mockChat} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should display the message text', () => {
      const { getByText } = render(<UserChatBox chat={mockChat} />);
      expect(getByText('Hello, this is a test message')).toBeTruthy();
    });

    it('should match snapshot', () => {
      const { toJSON } = render(<UserChatBox chat={mockChat} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Message Content', () => {
    it('should display empty message', () => {
      const emptyChat = { ...mockChat, message: '' };
      const { getByText } = render(<UserChatBox chat={emptyChat} />);
      expect(getByText('')).toBeTruthy();
    });

    it('should display special characters', () => {
      const specialChat = { ...mockChat, message: '!@#$%^&*()_+-=' };
      const { getByText } = render(<UserChatBox chat={specialChat} />);
      expect(getByText('!@#$%^&*()_+-=')).toBeTruthy();
    });

    it('should display unicode characters', () => {
      const unicodeChat = { ...mockChat, message: '안녕하세요 😊' };
      const { getByText } = render(<UserChatBox chat={unicodeChat} />);
      expect(getByText('안녕하세요 😊')).toBeTruthy();
    });

    it('should display multiline messages', () => {
      const multilineChat = {
        ...mockChat,
        message: 'Line 1\nLine 2\nLine 3',
      };
      const { getByText } = render(<UserChatBox chat={multilineChat} />);
      expect(getByText('Line 1\nLine 2\nLine 3')).toBeTruthy();
    });

    it('should display very long messages', () => {
      const longMessage = 'a'.repeat(1000);
      const longChat = { ...mockChat, message: longMessage };
      const { getByText } = render(<UserChatBox chat={longChat} />);
      expect(getByText(longMessage)).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should accept chat prop with required fields', () => {
      expect(() => {
        render(<UserChatBox chat={mockChat} />);
      }).not.toThrow();
    });

    it('should handle different time formats', () => {
      const times = ['12:00', '23:59', '00:00', '2024-01-01T12:00:00Z'];
      
      times.forEach((time) => {
        const chat = { ...mockChat, time };
        expect(() => {
          render(<UserChatBox chat={chat} />);
        }).not.toThrow();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only messages', () => {
      const whitespaceChat = { ...mockChat, message: '   ' };
      const { getByText } = render(<UserChatBox chat={whitespaceChat} />);
      expect(getByText('   ')).toBeTruthy();
    });

    it('should handle HTML-like content', () => {
      const htmlChat = {
        ...mockChat,
        message: '<script>alert("xss")</script>',
      };
      const { getByText } = render(<UserChatBox chat={htmlChat} />);
      expect(getByText('<script>alert("xss")</script>')).toBeTruthy();
    });

    it('should handle messages with URLs', () => {
      const urlChat = {
        ...mockChat,
        message: 'Check this out: https://example.com',
      };
      const { getByText } = render(<UserChatBox chat={urlChat} />);
      expect(getByText('Check this out: https://example.com')).toBeTruthy();
    });
  });
});