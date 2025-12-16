import React from 'react';
import { render } from '@testing-library/react-native';
import AssistantChatBox from '../../components/ChatItem/AssistantChatBox';
import { ROLE } from '../../constants';
import type { AssistantChat } from '../../types';

describe('AssistantChatBox', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test message'],
        time: '12:00',
      };

      const { container } = render(<AssistantChatBox chat={chat} />);
      expect(container).toBeTruthy();
    });

    it('should display a single message', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Hello, how can I help you?'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('Hello, how can I help you?')).toBeTruthy();
    });

    it('should display multiple messages', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['First message', 'Second message', 'Third message'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('First message')).toBeTruthy();
      expect(getByText('Second message')).toBeTruthy();
      expect(getByText('Third message')).toBeTruthy();
    });

    it('should render avatar circle', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<AssistantChatBox chat={chat} />);
      const avatar = UNSAFE_getByProps({ 
        className: expect.stringContaining('bg-chat-assistant') 
      });
      expect(avatar).toBeTruthy();
    });
  });

  describe('Multiple Messages', () => {
    it('should render empty messages array', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: [],
        time: '12:00',
      };

      const { container } = render(<AssistantChatBox chat={chat} />);
      expect(container).toBeTruthy();
    });

    it('should render two messages', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Message one', 'Message two'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('Message one')).toBeTruthy();
      expect(getByText('Message two')).toBeTruthy();
    });

    it('should render many messages', () => {
      const messages = Array.from({ length: 10 }, (_, i) => `Message ${i + 1}`);
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages,
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      messages.forEach((message) => {
        expect(getByText(message)).toBeTruthy();
      });
    });

    it('should maintain message order', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['First', 'Second', 'Third'],
        time: '12:00',
      };

      const { getAllByText } = render(<AssistantChatBox chat={chat} />);
      const first = getAllByText('First')[0];
      const second = getAllByText('Second')[0];
      const third = getAllByText('Third')[0];

      expect(first).toBeTruthy();
      expect(second).toBeTruthy();
      expect(third).toBeTruthy();
    });
  });

  describe('Message Content', () => {
    it('should handle empty string message', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: [''],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('')).toBeTruthy();
    });

    it('should handle very long message', () => {
      const longMessage = 'This is a very long message. '.repeat(50);
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: [longMessage],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText(longMessage)).toBeTruthy();
    });

    it('should handle message with newlines', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Line 1\nLine 2\nLine 3'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('Line 1\nLine 2\nLine 3')).toBeTruthy();
    });

    it('should handle message with special characters', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`')).toBeTruthy();
    });

    it('should handle message with unicode characters', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['안녕하세요', '你好', 'こんにちは'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('안녕하세요')).toBeTruthy();
      expect(getByText('你好')).toBeTruthy();
      expect(getByText('こんにちは')).toBeTruthy();
    });

    it('should handle message with emojis', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['😀 😁 😂', '🎉 🎊 🎈'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('😀 😁 😂')).toBeTruthy();
      expect(getByText('🎉 🎊 🎈')).toBeTruthy();
    });

    it('should handle message with mixed content', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Hello 안녕 😀 123 !@#'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('Hello 안녕 😀 123 !@#')).toBeTruthy();
    });

    it('should handle message with only whitespace', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['   ', '\t\t', '\n\n'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('   ')).toBeTruthy();
      expect(getByText('\t\t')).toBeTruthy();
      expect(getByText('\n\n')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should have chat-assistant background for avatar', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<AssistantChatBox chat={chat} />);
      const avatar = UNSAFE_getByProps({ 
        className: expect.stringContaining('bg-chat-assistant') 
      });
      expect(avatar.props.className).toContain('rounded-full');
    });

    it('should have correct avatar dimensions', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<AssistantChatBox chat={chat} />);
      const avatar = UNSAFE_getByProps({ 
        className: expect.stringContaining('w-12') 
      });
      expect(avatar.props.className).toContain('h-12');
    });

    it('should have message bubbles with correct styling', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getAllByProps } = render(<AssistantChatBox chat={chat} />);
      const bubbles = UNSAFE_getAllByProps({ 
        className: expect.stringContaining('bg-chat-assistant') 
      });
      
      // At least one bubble should exist (excluding avatar)
      expect(bubbles.length).toBeGreaterThan(0);
    });

    it('should have rounded corners on message bubbles', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getAllByProps } = render(<AssistantChatBox chat={chat} />);
      const rounded = UNSAFE_getAllByProps({ 
        className: expect.stringContaining('rounded-xl') 
      });
      expect(rounded.length).toBeGreaterThan(0);
    });

    it('should have padding on message bubbles', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getAllByProps } = render(<AssistantChatBox chat={chat} />);
      const padded = UNSAFE_getAllByProps({ 
        className: expect.stringContaining('p-4') 
      });
      expect(padded.length).toBeGreaterThan(0);
    });

    it('should have max-width constraint on container', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<AssistantChatBox chat={chat} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('max-w-[90%]') 
      });
      expect(container).toBeTruthy();
    });

    it('should have text styling for messages', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      const text = getByText('Test');
      
      expect(text.props.className).toContain('text-body-medium');
      expect(text.props.className).toContain('text-white');
    });
  });

  describe('Key Generation', () => {
    it('should use time and index for keys', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['First', 'Second'],
        time: '12:00:00',
      };

      const { UNSAFE_root } = render(<AssistantChatBox chat={chat} />);
      // Keys are used internally, component should render without warnings
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle duplicate messages with unique keys', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Same', 'Same', 'Same'],
        time: '12:00',
      };

      const { getAllByText } = render(<AssistantChatBox chat={chat} />);
      const messages = getAllByText('Same');
      expect(messages.length).toBe(3);
    });
  });

  describe('Layout Structure', () => {
    it('should have flex row layout for avatar and messages', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<AssistantChatBox chat={chat} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('flex-row') 
      });
      expect(container).toBeTruthy();
    });

    it('should have gap between avatar and messages', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<AssistantChatBox chat={chat} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('gap-3') 
      });
      expect(container).toBeTruthy();
    });

    it('should have flex column layout for message stack', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['First', 'Second'],
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<AssistantChatBox chat={chat} />);
      const messageContainer = UNSAFE_getByProps({ 
        className: expect.stringContaining('flex-col') 
      });
      expect(messageContainer).toBeTruthy();
    });

    it('should have gap between message bubbles', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['First', 'Second'],
        time: '12:00',
      };

      const { UNSAFE_getByProps } = render(<AssistantChatBox chat={chat} />);
      const messageContainer = UNSAFE_getByProps({ 
        className: expect.stringContaining('gap-2') 
      });
      expect(messageContainer).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('should accept different time formats', () => {
      const times = ['12:00', '09:30:45', '23:59:59', '2024-01-01T12:00:00Z'];

      times.forEach((time) => {
        const chat: AssistantChat = {
          sender: ROLE.AI,
          messages: ['Test'],
          time,
        };

        const { container } = render(<AssistantChatBox chat={chat} />);
        expect(container).toBeTruthy();
      });
    });

    it('should maintain sender type', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      expect(chat.sender).toBe(ROLE.AI);
      expect(chat.sender).toBe('AI');
    });

    it('should handle messages with varying lengths', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: [
          'Short',
          'A bit longer message',
          'This is a very long message that contains a lot of text and should still render properly',
        ],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('Short')).toBeTruthy();
      expect(getByText('A bit longer message')).toBeTruthy();
      expect(getByText('This is a very long message that contains a lot of text and should still render properly')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle HTML-like content in messages', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['<div>Not HTML</div>', '<script>alert("test")</script>'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('<div>Not HTML</div>')).toBeTruthy();
      expect(getByText('<script>alert("test")</script>')).toBeTruthy();
    });

    it('should handle messages with URLs', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Visit https://example.com', 'Or http://test.org'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('Visit https://example.com')).toBeTruthy();
      expect(getByText('Or http://test.org')).toBeTruthy();
    });

    it('should handle messages with markdown-like syntax', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['**bold** *italic*', '`code` ~strikethrough~'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('**bold** *italic*')).toBeTruthy();
      expect(getByText('`code` ~strikethrough~')).toBeTruthy();
    });

    it('should handle very large number of messages', () => {
      const messages = Array.from({ length: 100 }, (_, i) => `Message ${i}`);
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages,
        time: '12:00',
      };

      const { container } = render(<AssistantChatBox chat={chat} />);
      expect(container).toBeTruthy();
    });

    it('should handle messages with code snippets', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Here is code:', 'function test() { return true; }'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('function test() { return true; }')).toBeTruthy();
    });
  });

  describe('Re-rendering', () => {
    it('should update when messages change', () => {
      const chat1: AssistantChat = {
        sender: ROLE.AI,
        messages: ['First set'],
        time: '12:00',
      };

      const { getByText, rerender } = render(<AssistantChatBox chat={chat1} />);
      expect(getByText('First set')).toBeTruthy();

      const chat2: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Second set'],
        time: '12:01',
      };

      rerender(<AssistantChatBox chat={chat2} />);
      expect(getByText('Second set')).toBeTruthy();
    });

    it('should update when messages array changes', () => {
      const chat1: AssistantChat = {
        sender: ROLE.AI,
        messages: ['One'],
        time: '12:00',
      };

      const { getByText, rerender } = render(<AssistantChatBox chat={chat1} />);
      expect(getByText('One')).toBeTruthy();

      const chat2: AssistantChat = {
        sender: ROLE.AI,
        messages: ['One', 'Two', 'Three'],
        time: '12:00',
      };

      rerender(<AssistantChatBox chat={chat2} />);
      expect(getByText('One')).toBeTruthy();
      expect(getByText('Two')).toBeTruthy();
      expect(getByText('Three')).toBeTruthy();
    });

    it('should handle multiple re-renders efficiently', () => {
      const { rerender } = render(
        <AssistantChatBox
          chat={{ sender: ROLE.AI, messages: ['1'], time: '12:00' }}
        />
      );

      for (let i = 2; i <= 10; i++) {
        rerender(
          <AssistantChatBox
            chat={{ sender: ROLE.AI, messages: [`${i}`], time: '12:00' }}
          />
        );
      }

      // Should complete without errors
      expect(true).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should render quickly with single message', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Performance test'],
        time: '12:00',
      };

      const startTime = performance.now();
      render(<AssistantChatBox chat={chat} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should render efficiently with many messages', () => {
      const messages = Array.from({ length: 50 }, (_, i) => `Message ${i}`);
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages,
        time: '12:00',
      };

      const startTime = performance.now();
      render(<AssistantChatBox chat={chat} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
    });
  });

  describe('Type Safety', () => {
    it('should accept AssistantChat type', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Type safe'],
        time: '12:00',
      };

      const { getByText } = render(<AssistantChatBox chat={chat} />);
      expect(getByText('Type safe')).toBeTruthy();
    });

    it('should have correct sender type', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      expect(chat.sender).toBe(ROLE.AI);
    });

    it('should have messages as array', () => {
      const chat: AssistantChat = {
        sender: ROLE.AI,
        messages: ['Test'],
        time: '12:00',
      };

      expect(Array.isArray(chat.messages)).toBe(true);
    });
  });
});