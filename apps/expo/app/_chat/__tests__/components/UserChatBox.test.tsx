import React from 'react';
import { render } from '@testing-library/react-native';
import UserChatBox from '../../components/ChatItem/UserChatBox';
import { ROLE } from '../../constants';
import type { UserChat } from '../../types';

describe('UserChatBox', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test message',
        time: '12:00',
      };

      const { container } = render(<UserChatBox chat={chat} />);
      expect(container).toBeTruthy();
    });

    it('should display the message text', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Hello, how are you?',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('Hello, how are you?')).toBeTruthy();
    });

    it('should render with correct structure', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      const { UNSAFE_root } = render(<UserChatBox chat={chat} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Message Content', () => {
    it('should handle empty message', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: '',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('')).toBeTruthy();
    });

    it('should handle single character message', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'A',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('A')).toBeTruthy();
    });

    it('should handle very long message', () => {
      const longMessage = 'This is a very long message that contains a lot of text. '.repeat(10);
      const chat: UserChat = {
        sender: ROLE.USER,
        message: longMessage,
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText(longMessage)).toBeTruthy();
    });

    it('should handle message with newlines', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Line 1\nLine 2\nLine 3',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('Line 1\nLine 2\nLine 3')).toBeTruthy();
    });

    it('should handle message with special characters', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`')).toBeTruthy();
    });

    it('should handle message with unicode characters', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: '안녕하세요',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('안녕하세요')).toBeTruthy();
    });

    it('should handle message with emojis', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: '😀 😁 😂 🤣 😃 😄',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('😀 😁 😂 🤣 😃 😄')).toBeTruthy();
    });

    it('should handle message with mixed content', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Hello 안녕 😀 123 !@#',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('Hello 안녕 😀 123 !@#')).toBeTruthy();
    });

    it('should handle message with only whitespace', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: '   ',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('   ')).toBeTruthy();
    });

    it('should handle message with tabs', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Tab\there',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('Tab\there')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should have chat-user background class', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<UserChatBox chat={chat} />);
      const container = UNSAFE_getByProps({ className: expect.stringContaining('bg-chat-user') });
      expect(container).toBeTruthy();
    });

    it('should have rounded corners class', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<UserChatBox chat={chat} />);
      const container = UNSAFE_getByProps({ className: expect.stringContaining('rounded-xl') });
      expect(container).toBeTruthy();
    });

    it('should have padding class', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<UserChatBox chat={chat} />);
      const container = UNSAFE_getByProps({ className: expect.stringContaining('p-4') });
      expect(container).toBeTruthy();
    });

    it('should have max-width constraint', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<UserChatBox chat={chat} />);
      const container = UNSAFE_getByProps({ className: expect.stringContaining('max-w-[90%]') });
      expect(container).toBeTruthy();
    });

    it('should have left margin class', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<UserChatBox chat={chat} />);
      const container = UNSAFE_getByProps({ className: expect.stringContaining('ml-10') });
      expect(container).toBeTruthy();
    });

    it('should have text styling for message', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      const text = getByText('Test');
      
      expect(text.props.className).toContain('text-body-medium');
      expect(text.props.className).toContain('text-white');
    });
  });

  describe('Props Handling', () => {
    it('should accept different message values', () => {
      const messages = [
        'Short',
        'A much longer message that spans multiple words and contains various content',
        '123456789',
        'Mixed 한글 123',
      ];

      messages.forEach((message) => {
        const chat: UserChat = {
          sender: ROLE.USER,
          message,
          time: '12:00',
        };

        const { getByText } = render(<UserChatBox chat={chat} />);
        expect(getByText(message)).toBeTruthy();
      });
    });

    it('should accept different time values', () => {
      const times = ['12:00', '09:30', '23:59', '00:00'];

      times.forEach((time) => {
        const chat: UserChat = {
          sender: ROLE.USER,
          message: 'Test',
          time,
        };

        // Time is not displayed in component, but should be accepted
        const { container } = render(<UserChatBox chat={chat} />);
        expect(container).toBeTruthy();
      });
    });

    it('should maintain sender type', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      expect(chat.sender).toBe(ROLE.USER);
      expect(chat.sender).toBe('USER');
    });
  });

  describe('Edge Cases', () => {
    it('should handle message with HTML-like content', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: '<div>Not actual HTML</div>',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('<div>Not actual HTML</div>')).toBeTruthy();
    });

    it('should handle message with script tags', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: '<script>alert("test")</script>',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('<script>alert("test")</script>')).toBeTruthy();
    });

    it('should handle message with URLs', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Check out https://example.com',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('Check out https://example.com')).toBeTruthy();
    });

    it('should handle message with email addresses', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Contact me at user@example.com',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('Contact me at user@example.com')).toBeTruthy();
    });

    it('should handle message with phone numbers', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Call me at +1-234-567-8900',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('Call me at +1-234-567-8900')).toBeTruthy();
    });

    it('should handle message with markdown-like syntax', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: '**bold** *italic* `code`',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('**bold** *italic* `code`')).toBeTruthy();
    });

    it('should handle very large messages efficiently', () => {
      const largeMessage = 'word '.repeat(1000);
      const chat: UserChat = {
        sender: ROLE.USER,
        message: largeMessage,
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText(largeMessage)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should render text that is accessible', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Accessible message',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      const text = getByText('Accessible message');
      
      expect(text).toBeTruthy();
      expect(text.props.children).toBe('Accessible message');
    });
  });

  describe('Re-rendering', () => {
    it('should update when message changes', () => {
      const chat1: UserChat = {
        sender: ROLE.USER,
        message: 'First message',
        time: '12:00',
      };

      const { getByText, rerender } = render(<UserChatBox chat={chat1} />);
      expect(getByText('First message')).toBeTruthy();

      const chat2: UserChat = {
        sender: ROLE.USER,
        message: 'Second message',
        time: '12:01',
      };

      rerender(<UserChatBox chat={chat2} />);
      expect(getByText('Second message')).toBeTruthy();
    });

    it('should handle multiple re-renders', () => {
      const messages = ['Msg 1', 'Msg 2', 'Msg 3', 'Msg 4'];
      const { getByText, rerender } = render(
        <UserChatBox
          chat={{ sender: ROLE.USER, message: messages[0], time: '12:00' }}
        />
      );

      messages.forEach((message, index) => {
        if (index > 0) {
          rerender(
            <UserChatBox
              chat={{ sender: ROLE.USER, message, time: `12:0${index}` }}
            />
          );
        }
        expect(getByText(message)).toBeTruthy();
      });
    });
  });

  describe('Performance', () => {
    it('should render quickly with normal message', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Performance test message',
        time: '12:00',
      };

      const startTime = performance.now();
      render(<UserChatBox chat={chat} />);
      const endTime = performance.now();

      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle multiple instances efficiently', () => {
      const chats = Array.from({ length: 10 }, (_, i) => ({
        sender: ROLE.USER,
        message: `Message ${i}`,
        time: `12:0${i}`,
      }));

      const startTime = performance.now();
      chats.forEach((chat) => {
        render(<UserChatBox chat={chat as UserChat} />);
      });
      const endTime = performance.now();

      // Should render all in less than 500ms
      expect(endTime - startTime).toBeLessThan(500);
    });
  });

  describe('Type Safety', () => {
    it('should accept UserChat type', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Type safe message',
        time: '12:00',
      };

      const { getByText } = render(<UserChatBox chat={chat} />);
      expect(getByText('Type safe message')).toBeTruthy();
    });

    it('should have correct sender type', () => {
      const chat: UserChat = {
        sender: ROLE.USER,
        message: 'Test',
        time: '12:00',
      };

      expect(chat.sender).toBe(ROLE.USER);
    });
  });
});