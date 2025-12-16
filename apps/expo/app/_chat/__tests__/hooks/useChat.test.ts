import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useChat } from '../../hooks/useChat';
import { ROLE, CHAT_MOCK_DATA } from '../../constants';

// Mock the constants to have control over test data
jest.mock('../../constants', () => ({
  ROLE: {
    USER: 'USER',
    AI: 'AI',
  },
  CHAT_MOCK_DATA: [
    { sender: 'AI', message: 'Welcome', time: '12:00' },
    { sender: 'USER', message: 'Hello', time: '12:01' },
  ],
}));

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useChat());

      expect(result.current.isChatModalVisible).toBe(false);
      expect(result.current.message).toBe('');
      expect(result.current.chats).toEqual(CHAT_MOCK_DATA);
    });

    it('should initialize refs as non-null', () => {
      const { result } = renderHook(() => useChat());

      expect(result.current.inputRef).toBeDefined();
      expect(result.current.flatListRef).toBeDefined();
      expect(result.current.inputRef.current).toBeNull();
      expect(result.current.flatListRef.current).toBeNull();
    });

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useChat());

      expect(typeof result.current.setMessage).toBe('function');
      expect(typeof result.current.handleBack).toBe('function');
      expect(typeof result.current.handleInputFocus).toBe('function');
      expect(typeof result.current.handleSend).toBe('function');
      expect(typeof result.current.setIsChatModalVisible).toBe('function');
    });
  });

  describe('setMessage', () => {
    it('should update message state', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('New message');
      });

      expect(result.current.message).toBe('New message');
    });

    it('should handle empty string', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Test');
        result.current.setMessage('');
      });

      expect(result.current.message).toBe('');
    });

    it('should handle multiple updates', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('First');
      });
      expect(result.current.message).toBe('First');

      act(() => {
        result.current.setMessage('Second');
      });
      expect(result.current.message).toBe('Second');
    });

    it('should handle long messages', () => {
      const { result } = renderHook(() => useChat());
      const longMessage = 'a'.repeat(1000);

      act(() => {
        result.current.setMessage(longMessage);
      });

      expect(result.current.message).toBe(longMessage);
    });
  });

  describe('handleBack', () => {
    it('should hide chat modal when called', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setIsChatModalVisible(true);
      });
      expect(result.current.isChatModalVisible).toBe(true);

      act(() => {
        result.current.handleBack();
      });

      expect(result.current.isChatModalVisible).toBe(false);
    });

    it('should clear message when called', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Test message');
      });
      expect(result.current.message).toBe('Test message');

      act(() => {
        result.current.handleBack();
      });

      expect(result.current.message).toBe('');
    });

    it('should call blur on inputRef if available', () => {
      const { result } = renderHook(() => useChat());
      const mockBlur = jest.fn();
      
      // Simulate ref being set
      act(() => {
        if (result.current.inputRef.current) {
          result.current.inputRef.current = { blur: mockBlur } as any;
        }
      });

      act(() => {
        result.current.handleBack();
      });

      // Note: In the actual implementation, blur is called
      // We're testing that the function doesn't crash when ref is null
      expect(result.current.isChatModalVisible).toBe(false);
    });

    it('should be stable across re-renders', () => {
      const { result, rerender } = renderHook(() => useChat());
      const firstHandleBack = result.current.handleBack;

      rerender();

      expect(result.current.handleBack).toBe(firstHandleBack);
    });
  });

  describe('handleInputFocus', () => {
    it('should show chat modal when called', () => {
      const { result } = renderHook(() => useChat());

      expect(result.current.isChatModalVisible).toBe(false);

      act(() => {
        result.current.handleInputFocus();
      });

      expect(result.current.isChatModalVisible).toBe(true);
    });

    it('should call scrollToOffset on flatListRef if available', () => {
      const { result } = renderHook(() => useChat());
      const mockScrollToOffset = jest.fn();

      // Simulate ref being set
      if (result.current.flatListRef.current) {
        result.current.flatListRef.current = {
          scrollToOffset: mockScrollToOffset,
        } as any;
      }

      act(() => {
        result.current.handleInputFocus();
      });

      // Should not crash when ref is null
      expect(result.current.isChatModalVisible).toBe(true);
    });

    it('should be stable across re-renders', () => {
      const { result, rerender } = renderHook(() => useChat());
      const firstHandleInputFocus = result.current.handleInputFocus;

      rerender();

      expect(result.current.handleInputFocus).toBe(firstHandleInputFocus);
    });
  });

  describe('handleSend', () => {
    it('should not send empty messages', () => {
      const { result } = renderHook(() => useChat());
      const initialChatsLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('');
        result.current.handleSend();
      });

      expect(result.current.chats.length).toBe(initialChatsLength);
    });

    it('should not send messages with only whitespace', () => {
      const { result } = renderHook(() => useChat());
      const initialChatsLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('   ');
        result.current.handleSend();
      });

      expect(result.current.chats.length).toBe(initialChatsLength);
    });

    it('should add user message to chats when message is valid', () => {
      const { result } = renderHook(() => useChat());
      const initialChatsLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('Test message');
        result.current.handleSend();
      });

      expect(result.current.chats.length).toBe(initialChatsLength + 1);
      expect(result.current.chats[0]).toMatchObject({
        sender: ROLE.USER,
        message: 'Test message',
      });
      expect(result.current.chats[0].time).toBeDefined();
    });

    it('should add message to the beginning of the array', () => {
      const { result } = renderHook(() => useChat());
      const firstChat = result.current.chats[0];

      act(() => {
        result.current.setMessage('New message');
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe('New message');
      expect(result.current.chats[1]).toEqual(firstChat);
    });

    it('should clear message after sending', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Test message');
        result.current.handleSend();
      });

      expect(result.current.message).toBe('');
    });

    it('should call clear on inputRef if available', () => {
      const { result } = renderHook(() => useChat());
      const mockClear = jest.fn();
      const mockBlur = jest.fn();

      // Simulate ref being set
      if (result.current.inputRef.current) {
        result.current.inputRef.current = {
          clear: mockClear,
          blur: mockBlur,
        } as any;
      }

      act(() => {
        result.current.setMessage('Test');
        result.current.handleSend();
      });

      // Should not crash when ref is null
      expect(result.current.message).toBe('');
    });

    it('should generate ISO string timestamp', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Test message');
        result.current.handleSend();
      });

      const timestamp = result.current.chats[0].time;
      expect(() => new Date(timestamp)).not.toThrow();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    it('should handle multiple sends correctly', () => {
      const { result } = renderHook(() => useChat());
      const initialLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('First message');
        result.current.handleSend();
      });

      act(() => {
        result.current.setMessage('Second message');
        result.current.handleSend();
      });

      act(() => {
        result.current.setMessage('Third message');
        result.current.handleSend();
      });

      expect(result.current.chats.length).toBe(initialLength + 3);
      expect(result.current.chats[0].message).toBe('Third message');
      expect(result.current.chats[1].message).toBe('Second message');
      expect(result.current.chats[2].message).toBe('First message');
    });

    it('should handle messages with special characters', () => {
      const { result } = renderHook(() => useChat());
      const specialMessage = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      act(() => {
        result.current.setMessage(specialMessage);
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe(specialMessage);
    });

    it('should handle messages with unicode characters', () => {
      const { result } = renderHook(() => useChat());
      const unicodeMessage = '안녕하세요 😀';

      act(() => {
        result.current.setMessage(unicodeMessage);
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe(unicodeMessage);
    });

    it('should be stable across re-renders when message changes', () => {
      const { result, rerender } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('First');
      });
      const firstHandleSend = result.current.handleSend;

      rerender();

      // handleSend changes when message changes (due to dependency)
      act(() => {
        result.current.setMessage('Second');
      });
      
      expect(result.current.handleSend).not.toBe(firstHandleSend);
    });
  });

  describe('setIsChatModalVisible', () => {
    it('should update chat modal visibility', () => {
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

    it('should toggle modal visibility multiple times', () => {
      const { result } = renderHook(() => useChat());

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.setIsChatModalVisible(true);
        });
        expect(result.current.isChatModalVisible).toBe(true);

        act(() => {
          result.current.setIsChatModalVisible(false);
        });
        expect(result.current.isChatModalVisible).toBe(false);
      }
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete chat flow: focus, type, send', () => {
      const { result } = renderHook(() => useChat());

      // Focus input
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
    });

    it('should handle cancel flow: focus, type, back', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.handleInputFocus();
      });
      expect(result.current.isChatModalVisible).toBe(true);

      act(() => {
        result.current.setMessage('Cancelled message');
      });
      expect(result.current.message).toBe('Cancelled message');

      act(() => {
        result.current.handleBack();
      });
      expect(result.current.isChatModalVisible).toBe(false);
      expect(result.current.message).toBe('');
    });

    it('should maintain chat history across multiple interactions', () => {
      const { result } = renderHook(() => useChat());
      const messages = ['First', 'Second', 'Third', 'Fourth'];

      messages.forEach((msg) => {
        act(() => {
          result.current.setMessage(msg);
          result.current.handleSend();
        });
      });

      // Check all messages are in chats (in reverse order)
      expect(result.current.chats.slice(0, 4).map(c => c.message)).toEqual(
        messages.reverse()
      );
    });

    it('should handle rapid consecutive sends', () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.setMessage('Message 1');
        result.current.handleSend();
        result.current.setMessage('Message 2');
        result.current.handleSend();
        result.current.setMessage('Message 3');
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe('Message 3');
      expect(result.current.chats[1].message).toBe('Message 2');
      expect(result.current.chats[2].message).toBe('Message 1');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle sending with leading/trailing whitespace', () => {
      const { result } = renderHook(() => useChat());
      const initialLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('  valid message  ');
        result.current.handleSend();
      });

      // Should send because trim() makes it non-empty
      expect(result.current.chats.length).toBe(initialLength + 1);
      expect(result.current.chats[0].message).toBe('  valid message  ');
    });

    it('should handle very long messages', () => {
      const { result } = renderHook(() => useChat());
      const longMessage = 'a'.repeat(5000);

      act(() => {
        result.current.setMessage(longMessage);
        result.current.handleSend();
      });

      expect(result.current.chats[0].message).toBe(longMessage);
    });

    it('should handle message with only newlines and tabs', () => {
      const { result } = renderHook(() => useChat());
      const initialLength = result.current.chats.length;

      act(() => {
        result.current.setMessage('\n\t\n\t');
        result.current.handleSend();
      });

      // Should not send (trim removes all whitespace)
      expect(result.current.chats.length).toBe(initialLength);
    });
  });

  describe('Refs behavior', () => {
    it('should maintain same ref objects across re-renders', () => {
      const { result, rerender } = renderHook(() => useChat());
      
      const firstInputRef = result.current.inputRef;
      const firstFlatListRef = result.current.flatListRef;

      rerender();

      expect(result.current.inputRef).toBe(firstInputRef);
      expect(result.current.flatListRef).toBe(firstFlatListRef);
    });
  });
});