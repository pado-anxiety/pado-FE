import { act, renderHook } from '@testing-library/react-hooks';
import { ROLE } from '../constants';
import { useChat } from '../hooks/useChat';

// Mock the constants
jest.mock('../constants', () => ({
  ROLE: {
    USER: 'USER',
    AI: 'AI',
  },
  CHAT_MOCK_DATA: [
    { sender: 'AI', message: 'Hello', time: '12:00' },
    { sender: 'USER', message: 'Hi', time: '12:01' },
  ],
}));

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useChat());

      expect(result.current.isChatModalVisible).toBe(false);
      expect(result.current.message).toBe('');
      expect(result.current.chats).toHaveLength(2);
      expect(result.current.inputRef.current).toBeNull();
      expect(result.current.flatListRef.current).toBeNull();
    });

    it('should initialize with mock data', () => {
      const { result } = renderHook(() => useChat());

      expect(result.current.chats[0].sender).toBe('AI');
      expect(result.current.chats[1].sender).toBe('USER');
    });
  });

  describe('setMessage', () => {
    it('should update message state', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Hello World');
      });

      expect(result.current.message).toBe('Hello World');
    });

    it('should allow empty message', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Test');
      });
      expect(result.current.message).toBe('Test');

      act(() => {
        result.current.setMessage('');
      });
      expect(result.current.message).toBe('');
    });

    it('should handle special characters', () => {
      const { result } = renderHook(() => useChat());
      const specialMessage = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      act(() => {
        result.current.setMessage(specialMessage);
      });

      expect(result.current.message).toBe(specialMessage);
    });

    it('should handle unicode and emojis', () => {
      const { result } = renderHook(() => useChat());
      const unicodeMessage = '안녕하세요 😊 こんにちは';

      act(() => {
        result.current.setMessage(unicodeMessage);
      });

      expect(result.current.message).toBe(unicodeMessage);
    });
  });

  describe('setIsChatModalVisible', () => {
    it('should toggle modal visibility to true', () => {
      const { result } = renderHook(() => useChat());

      expect(result.current.isChatModalVisible).toBe(false);

      act(() => {
        result.current.setIsChatModalVisible(true);
      });

      expect(result.current.isChatModalVisible).toBe(true);
    });

    it('should toggle modal visibility to false', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setIsChatModalVisible(true);
      });
      expect(result.current.isChatModalVisible).toBe(true);

      act(() => {
        result.current.setIsChatModalVisible(false);
      });
      expect(result.current.isChatModalVisible).toBe(false);
    });
  });

  describe('handleBack', () => {
    it('should reset modal visibility and message', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setIsChatModalVisible(true);
        result.current.setMessage('Some message');
      });

      expect(result.current.isChatModalVisible).toBe(true);
      expect(result.current.message).toBe('Some message');

      act(() => {
        result.current.handleBack();
      });

      expect(result.current.isChatModalVisible).toBe(false);
      expect(result.current.message).toBe('');
    });

    it('should be callable multiple times without error', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.handleBack();
        result.current.handleBack();
        result.current.handleBack();
      });

      expect(result.current.isChatModalVisible).toBe(false);
      expect(result.current.message).toBe('');
    });

    it('should maintain stable reference across renders', () => {
      const { result, rerender } = renderHook(() => useChat());
      const firstHandleBack = result.current.handleBack;

      rerender();

      expect(result.current.handleBack).toBe(firstHandleBack);
    });
  });

  describe('handleInputFocus', () => {
    it('should set modal visible when called', () => {
      const { result } = renderHook(() => useChat());

      expect(result.current.isChatModalVisible).toBe(false);

      act(() => {
        result.current.handleInputFocus();
      });

      expect(result.current.isChatModalVisible).toBe(true);
    });

    it('should be idempotent', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.handleInputFocus();
        result.current.handleInputFocus();
      });

      expect(result.current.isChatModalVisible).toBe(true);
    });

    it('should maintain stable reference across renders', () => {
      const { result, rerender } = renderHook(() => useChat());
      const firstHandleInputFocus = result.current.handleInputFocus;

      rerender();

      expect(result.current.handleInputFocus).toBe(firstHandleInputFocus);
    });
  });

  describe('handleSend', () => {
    it('should add user message to chats', () => {
      const { result } = renderHook(() => useChat());
      const initialLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('New message');
      });

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats).toHaveLength(initialLength + 1);
      expect(result.current.chats[0].sender).toBe(ROLE.USER);
      expect(result.current.chats[0].message).toBe('New message');
    });

    it('should clear message after sending', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Test message');
      });
      expect(result.current.message).toBe('Test message');

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.message).toBe('');
    });

    it('should not send empty message', () => {
      const { result } = renderHook(() => useChat());
      const initialLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('');
      });

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats).toHaveLength(initialLength);
    });

    it('should not send whitespace-only message', () => {
      const { result } = renderHook(() => useChat());
      const initialLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('   ');
      });

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats).toHaveLength(initialLength);
      expect(result.current.message).toBe('   ');
    });

    it('should trim message before validation but send original', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('  message with spaces  ');
      });

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe('  message with spaces  ');
    });

    it('should add timestamp to message', () => {
      const { result } = renderHook(() => useChat());
      const beforeSend = new Date().getTime();

      act(() => {
        result.current.setMessage('Test');
      });

      act(() => {
        result.current.handleSend();
      });

      const afterSend = new Date().getTime();
      const messageTime = new Date(result.current.chats[0].time).getTime();

      expect(messageTime).toBeGreaterThanOrEqual(beforeSend);
      expect(messageTime).toBeLessThanOrEqual(afterSend);
    });

    it('should add message to beginning of array', () => {
      const { result } = renderHook(() => useChat());
      const firstMessage = result.current.chats[0];

      act(() => {
        result.current.setMessage('New message');
      });

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe('New message');
      expect(result.current.chats[1]).toEqual(firstMessage);
    });

    it('should handle multiple sends', () => {
      const { result } = renderHook(() => useChat());
      const initialLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('Message 1');
      });
      act(() => {
        result.current.handleSend();
      });

      act(() => {
        result.current.setMessage('Message 2');
      });
      act(() => {
        result.current.handleSend();
      });

      act(() => {
        result.current.setMessage('Message 3');
      });
      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats).toHaveLength(initialLength + 3);
      expect(result.current.chats[0].message).toBe('Message 3');
      expect(result.current.chats[1].message).toBe('Message 2');
      expect(result.current.chats[2].message).toBe('Message 1');
    });

    it('should not affect message dependency when message changes after send', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Original');
      });

      const handleSendRef = result.current.handleSend;

      act(() => {
        result.current.setMessage('Changed');
      });

      // handleSend should be recreated due to message dependency
      expect(result.current.handleSend).not.toBe(handleSendRef);
    });
  });

  describe('Refs', () => {
    it('should provide stable ref objects', () => {
      const { result, rerender } = renderHook(() => useChat());
      
      const firstInputRef = result.current.inputRef;
      const firstFlatListRef = result.current.flatListRef;

      rerender();

      expect(result.current.inputRef).toBe(firstInputRef);
      expect(result.current.flatListRef).toBe(firstFlatListRef);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete chat flow', () => {
      const { result } = renderHook(() => useChat());

      // Open modal
      act(() => {
        result.current.handleInputFocus();
      });
      expect(result.current.isChatModalVisible).toBe(true);

      // Type message
      act(() => {
        result.current.setMessage('Hello AI');
      });
      expect(result.current.message).toBe('Hello AI');

      // Send message
      act(() => {
        result.current.handleSend();
      });
      expect(result.current.message).toBe('');
      expect(result.current.chats[0].message).toBe('Hello AI');
      expect(result.current.chats[0].sender).toBe(ROLE.USER);

      // Close modal
      act(() => {
        result.current.handleBack();
      });
      expect(result.current.isChatModalVisible).toBe(false);
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setIsChatModalVisible(true);
        result.current.setMessage('Fast');
        result.current.setIsChatModalVisible(false);
        result.current.setMessage('');
        result.current.setIsChatModalVisible(true);
      });

      expect(result.current.isChatModalVisible).toBe(true);
      expect(result.current.message).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long messages', () => {
      const { result } = renderHook(() => useChat());
      const longMessage = 'a'.repeat(10000);

      act(() => {
        result.current.setMessage(longMessage);
      });

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe(longMessage);
    });

    it('should handle newlines in messages', () => {
      const { result } = renderHook(() => useChat());
      const multilineMessage = 'Line 1\nLine 2\nLine 3';

      act(() => {
        result.current.setMessage(multilineMessage);
      });

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe(multilineMessage);
    });

    it('should handle message with only newlines as empty', () => {
      const { result } = renderHook(() => useChat());
      const initialLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('\n\n\n');
      });

      act(() => {
        result.current.handleSend();
      });

      expect(result.current.chats).toHaveLength(initialLength);
    });
  });
});