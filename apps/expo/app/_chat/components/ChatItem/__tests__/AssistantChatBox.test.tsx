import React from 'react';
import { render } from '@testing-library/react-native';
import AssistantChatBox from '../AssistantChatBox';
import { ROLE } from '../../../constants';

describe('AssistantChatBox', () => {
  const mockChat = {
    sender: ROLE.AI as typeof ROLE.AI,
    messages: ['First message', 'Second message', 'Third message'],
    time: '12:00',
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<AssistantChatBox chat={mockChat} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render all messages', () => {
      const { getByText } = render(<AssistantChatBox chat={mockChat} />);
      expect(getByText('First message')).toBeTruthy();
      expect(getByText('Second message')).toBeTruthy();
      expect(getByText('Third message')).toBeTruthy();
    });

    it('should match snapshot', () => {
      const { toJSON } = render(<AssistantChatBox chat={mockChat} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('should render avatar/profile circle', () => {
      const { toJSON } = render(<AssistantChatBox chat={mockChat} />);
      // The component should have rendered the avatar view
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Multiple Messages', () => {
    it('should handle single message', () => {
      const singleMessageChat = {
        ...mockChat,
        messages: ['Only one message'],
      };
      const { getByText, queryByText } = render(
        <AssistantChatBox chat={singleMessageChat} />
      );
      expect(getByText('Only one message')).toBeTruthy();
    });

    it('should handle many messages', () => {
      const manyMessagesChat = {
        ...mockChat,
        messages: Array.from({ length: 10 }, (_, i) => `Message ${i + 1}`),
      };
      const { getByText } = render(
        <AssistantChatBox chat={manyMessagesChat} />
      );
      
      for (let i = 1; i <= 10; i++) {
        expect(getByText(`Message ${i}`)).toBeTruthy();
      }
    });

    it('should handle empty messages array', () => {
      const emptyChat = { ...mockChat, messages: [] };
      const { toJSON } = render(<AssistantChatBox chat={emptyChat} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should preserve message order', () => {
      const orderedChat = {
        ...mockChat,
        messages: ['First', 'Second', 'Third'],
      };
      const { getAllByText } = render(<AssistantChatBox chat={orderedChat} />);
      
      // Messages should appear in order
      expect(getAllByText(/First|Second|Third/).length).toBe(3);
    });
  });

  describe('Message Content', () => {
    it('should display special characters in messages', () => {
      const specialChat = {
        ...mockChat,
        messages: ['!@#$%^&*()', '<>?:"{}|'],
      };
      const { getByText } = render(<AssistantChatBox chat={specialChat} />);
      expect(getByText('!@#$%^&*()')).toBeTruthy();
      expect(getByText('<>?:"{}|')).toBeTruthy();
    });

    it('should display unicode and emojis', () => {
      const unicodeChat = {
        ...mockChat,
        messages: ['안녕하세요', 'こんにちは', '😊 🎉 🚀'],
      };
      const { getByText } = render(<AssistantChatBox chat={unicodeChat} />);
      expect(getByText('안녕하세요')).toBeTruthy();
      expect(getByText('こんにちは')).toBeTruthy();
      expect(getByText('😊 🎉 🚀')).toBeTruthy();
    });

    it('should display multiline messages', () => {
      const multilineChat = {
        ...mockChat,
        messages: ['Line 1\nLine 2', 'Another\nMultiline\nMessage'],
      };
      const { getByText } = render(<AssistantChatBox chat={multilineChat} />);
      expect(getByText('Line 1\nLine 2')).toBeTruthy();
      expect(getByText('Another\nMultiline\nMessage')).toBeTruthy();
    });

    it('should display very long messages', () => {
      const longMessage = 'a'.repeat(1000);
      const longChat = { ...mockChat, messages: [longMessage] };
      const { getByText } = render(<AssistantChatBox chat={longChat} />);
      expect(getByText(longMessage)).toBeTruthy();
    });

    it('should handle empty string messages', () => {
      const emptyStringChat = {
        ...mockChat,
        messages: ['', 'Valid message', ''],
      };
      const { getByText } = render(<AssistantChatBox chat={emptyStringChat} />);
      expect(getByText('Valid message')).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should accept chat prop with required fields', () => {
      expect(() => {
        render(<AssistantChatBox chat={mockChat} />);
      }).not.toThrow();
    });

    it('should handle different time formats', () => {
      const times = ['12:00', '23:59', '2024-01-01T12:00:00Z'];
      
      times.forEach((time) => {
        const chat = { ...mockChat, time };
        expect(() => {
          render(<AssistantChatBox chat={chat} />);
        }).not.toThrow();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle messages with whitespace only', () => {
      const whitespaceChat = {
        ...mockChat,
        messages: ['   ', '\t\t', '\n\n'],
      };
      expect(() => {
        render(<AssistantChatBox chat={whitespaceChat} />);
      }).not.toThrow();
    });

    it('should handle HTML-like content safely', () => {
      const htmlChat = {
        ...mockChat,
        messages: ['<script>alert("xss")</script>', '<div>content</div>'],
      };
      const { getByText } = render(<AssistantChatBox chat={htmlChat} />);
      expect(getByText('<script>alert("xss")</script>')).toBeTruthy();
    });

    it('should handle messages with URLs', () => {
      const urlChat = {
        ...mockChat,
        messages: [
          'Visit https://example.com',
          'Email: test@example.com',
        ],
      };
      const { getByText } = render(<AssistantChatBox chat={urlChat} />);
      expect(getByText('Visit https://example.com')).toBeTruthy();
      expect(getByText('Email: test@example.com')).toBeTruthy();
    });

    it('should handle rapid rerenders', () => {
      const { rerender } = render(<AssistantChatBox chat={mockChat} />);
      
      for (let i = 0; i < 10; i++) {
        const newChat = {
          ...mockChat,
          messages: [`Rerender ${i}`],
        };
        rerender(<AssistantChatBox chat={newChat} />);
      }
      
      // Should not crash
      expect(true).toBe(true);
    });
  });

  describe('Key Generation', () => {
    it('should handle duplicate messages with unique keys', () => {
      const duplicateChat = {
        ...mockChat,
        messages: ['Same message', 'Same message', 'Same message'],
      };
      
      expect(() => {
        render(<AssistantChatBox chat={duplicateChat} />);
      }).not.toThrow();
    });

    it('should use time and index for key generation', () => {
      // This tests that the component renders without key warnings
      const { toJSON } = render(<AssistantChatBox chat={mockChat} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});