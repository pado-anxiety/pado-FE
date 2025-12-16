import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatInputBar from '../../components/ChatInputBar';

// Mock TextInput ref
const mockTextInputRef = {
  current: {
    focus: jest.fn(),
    blur: jest.fn(),
    clear: jest.fn(),
  },
};

describe('ChatInputBar', () => {
  const defaultProps = {
    message: '',
    onMessageChange: jest.fn(),
    onFocus: jest.fn(),
    onSend: jest.fn(),
    paddingBottom: { value: 0 } as any,
    ref: mockTextInputRef as any,
    isChatModalVisible: false,
    setIsChatModalVisible: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ChatInputBar {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render sparkles icon button', () => {
      const { UNSAFE_getByType } = render(<ChatInputBar {...defaultProps} />);
      const Ionicons = require('@expo/vector-icons').Ionicons;
      const icon = UNSAFE_getByType(Ionicons);
      expect(icon.props.name).toBe('sparkles');
    });

    it('should render send icon button', () => {
      const { UNSAFE_getByType } = render(<ChatInputBar {...defaultProps} />);
      const FontAwesome = require('@expo/vector-icons').FontAwesome;
      const icon = UNSAFE_getByType(FontAwesome);
      expect(icon.props.name).toBe('send');
    });

    it('should render text input with placeholder', () => {
      const { getByPlaceholderText } = render(<ChatInputBar {...defaultProps} />);
      expect(getByPlaceholderText('메시지를 입력해주세요')).toBeTruthy();
    });
  });

  describe('Input Behavior', () => {
    it('should call onMessageChange when text changes', () => {
      const onMessageChange = jest.fn();
      const { getByPlaceholderText } = render(
        <ChatInputBar {...defaultProps} onMessageChange={onMessageChange} />
      );

      const input = getByPlaceholderText('메시지를 입력해주세요');
      fireEvent.changeText(input, 'New message');

      expect(onMessageChange).toHaveBeenCalledWith('New message');
    });

    it('should call onFocus when input is focused', () => {
      const onFocus = jest.fn();
      const { getByPlaceholderText } = render(
        <ChatInputBar {...defaultProps} onFocus={onFocus} />
      );

      const input = getByPlaceholderText('메시지를 입력해주세요');
      fireEvent(input, 'focus');

      expect(onFocus).toHaveBeenCalled();
    });

    it('should display current message value', () => {
      const { getByDisplayValue } = render(
        <ChatInputBar {...defaultProps} message="Current message" />
      );

      expect(getByDisplayValue('Current message')).toBeTruthy();
    });

    it('should update when message prop changes', () => {
      const { getByPlaceholderText, rerender } = render(
        <ChatInputBar {...defaultProps} message="First" />
      );

      const input = getByPlaceholderText('메시지를 입력해주세요');
      expect(input.props.value).toBe('First');

      rerender(<ChatInputBar {...defaultProps} message="Second" />);
      expect(input.props.value).toBe('Second');
    });
  });

  describe('Send Button', () => {
    it('should call onSend when send button is pressed', () => {
      const onSend = jest.fn();
      const { UNSAFE_getByType } = render(
        <ChatInputBar {...defaultProps} message="Test" onSend={onSend} />
      );

      const FontAwesome = require('@expo/vector-icons').FontAwesome;
      const sendIcon = UNSAFE_getByType(FontAwesome);
      const sendButton = sendIcon.parent;

      fireEvent.press(sendButton);
      expect(onSend).toHaveBeenCalled();
    });

    it('should show different opacity when message is empty', () => {
      const { UNSAFE_getByType } = render(
        <ChatInputBar {...defaultProps} message="" />
      );

      const FontAwesome = require('@expo/vector-icons').FontAwesome;
      const icon = UNSAFE_getByType(FontAwesome);
      
      expect(icon.props.color).toBe('rgba(255, 255, 255, 0.5)');
    });

    it('should show different opacity when message has content', () => {
      const { UNSAFE_getByType } = render(
        <ChatInputBar {...defaultProps} message="Hello" />
      );

      const FontAwesome = require('@expo/vector-icons').FontAwesome;
      const icon = UNSAFE_getByType(FontAwesome);
      
      expect(icon.props.color).toBe('rgba(255, 255, 255, 0.8)');
    });
  });

  describe('Chat Modal Toggle', () => {
    it('should call setIsChatModalVisible when container is pressed and modal is closed', async () => {
      const setIsChatModalVisible = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ChatInputBar
          {...defaultProps}
          isChatModalVisible={false}
          setIsChatModalVisible={setIsChatModalVisible}
        />
      );

      const Pressable = require('react-native').Pressable;
      const pressables = UNSAFE_getAllByType(Pressable);
      const containerPressable = pressables[0]; // First Pressable is the container

      fireEvent.press(containerPressable);

      expect(setIsChatModalVisible).toHaveBeenCalledWith(true);
    });

    it('should not toggle modal when already visible', () => {
      const setIsChatModalVisible = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ChatInputBar
          {...defaultProps}
          isChatModalVisible={true}
          setIsChatModalVisible={setIsChatModalVisible}
        />
      );

      const Pressable = require('react-native').Pressable;
      const pressables = UNSAFE_getAllByType(Pressable);
      const containerPressable = pressables[0];

      fireEvent.press(containerPressable);

      expect(setIsChatModalVisible).not.toHaveBeenCalled();
    });
  });

  describe('Sparkles Button', () => {
    it('should not trigger action when modal is not visible', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { UNSAFE_getAllByType } = render(
        <ChatInputBar {...defaultProps} isChatModalVisible={false} />
      );

      const Pressable = require('react-native').Pressable;
      const pressables = UNSAFE_getAllByType(Pressable);
      const sparklesButton = pressables[1]; // Second Pressable is sparkles button

      fireEvent.press(sparklesButton);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log when pressed and modal is visible', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { UNSAFE_getAllByType } = render(
        <ChatInputBar {...defaultProps} isChatModalVisible={true} />
      );

      const Pressable = require('react-native').Pressable;
      const pressables = UNSAFE_getAllByType(Pressable);
      const sparklesButton = pressables[1];

      fireEvent.press(sparklesButton);

      expect(consoleSpy).toHaveBeenCalledWith('추천');
      consoleSpy.mockRestore();
    });
  });

  describe('Input Pointer Events', () => {
    it('should disable pointer events when modal is not visible', () => {
      const { getByPlaceholderText } = render(
        <ChatInputBar {...defaultProps} isChatModalVisible={false} />
      );

      const input = getByPlaceholderText('메시지를 입력해주세요');
      const inputContainer = input.parent;

      expect(inputContainer?.props.pointerEvents).toBe('none');
    });

    it('should enable pointer events when modal is visible', () => {
      const { getByPlaceholderText } = render(
        <ChatInputBar {...defaultProps} isChatModalVisible={true} />
      );

      const input = getByPlaceholderText('메시지를 입력해주세요');
      const inputContainer = input.parent;

      expect(inputContainer?.props.pointerEvents).toBe('auto');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      const { getByPlaceholderText } = render(
        <ChatInputBar {...defaultProps} message="" />
      );

      expect(getByPlaceholderText('메시지를 입력해주세요').props.value).toBe('');
    });

    it('should handle very long message', () => {
      const longMessage = 'a'.repeat(1000);
      const { getByDisplayValue } = render(
        <ChatInputBar {...defaultProps} message={longMessage} />
      );

      expect(getByDisplayValue(longMessage)).toBeTruthy();
    });

    it('should handle special characters in message', () => {
      const specialMessage = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
      const { getByDisplayValue } = render(
        <ChatInputBar {...defaultProps} message={specialMessage} />
      );

      expect(getByDisplayValue(specialMessage)).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      const unicodeMessage = '안녕하세요 😀';
      const { getByDisplayValue } = render(
        <ChatInputBar {...defaultProps} message={unicodeMessage} />
      );

      expect(getByDisplayValue(unicodeMessage)).toBeTruthy();
    });

    it('should handle message with newlines', () => {
      const multilineMessage = 'Line 1\nLine 2\nLine 3';
      const { getByDisplayValue } = render(
        <ChatInputBar {...defaultProps} message={multilineMessage} />
      );

      expect(getByDisplayValue(multilineMessage)).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should have correct background color style', () => {
      const { UNSAFE_getAllByType } = render(<ChatInputBar {...defaultProps} />);
      
      const Pressable = require('react-native').Pressable;
      const pressables = UNSAFE_getAllByType(Pressable);
      const container = pressables[0];

      expect(container.props.style).toEqual({ backgroundColor: 'rgba(65, 65, 65, 0.9)' });
    });

    it('should have border classes on container', () => {
      const { UNSAFE_getAllByType } = render(<ChatInputBar {...defaultProps} />);
      
      const Pressable = require('react-native').Pressable;
      const pressables = UNSAFE_getAllByType(Pressable);
      const container = pressables[0];

      expect(container.props.className).toContain('border-neutral-700');
      expect(container.props.className).toContain('rounded-full');
    });

    it('should have correct icon size for sparkles', () => {
      const { UNSAFE_getByType } = render(<ChatInputBar {...defaultProps} />);
      
      const Ionicons = require('@expo/vector-icons').Ionicons;
      const icon = UNSAFE_getByType(Ionicons);

      expect(icon.props.size).toBe(24);
    });

    it('should have correct icon size for send', () => {
      const { UNSAFE_getByType } = render(<ChatInputBar {...defaultProps} />);
      
      const FontAwesome = require('@expo/vector-icons').FontAwesome;
      const icon = UNSAFE_getByType(FontAwesome);

      expect(icon.props.size).toBe(22);
    });
  });

  describe('Hit Slop', () => {
    it('should have hit slop on sparkles button', () => {
      const { UNSAFE_getAllByType } = render(<ChatInputBar {...defaultProps} />);
      
      const Pressable = require('react-native').Pressable;
      const pressables = UNSAFE_getAllByType(Pressable);
      const sparklesButton = pressables[1];

      expect(sparklesButton.props.hitSlop).toEqual({
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      });
    });

    it('should have hit slop on send button', () => {
      const { UNSAFE_getAllByType } = render(<ChatInputBar {...defaultProps} />);
      
      const Pressable = require('react-native').Pressable;
      const pressables = UNSAFE_getAllByType(Pressable);
      const sendButton = pressables[2]; // Third Pressable is send button

      expect(sendButton.props.hitSlop).toEqual({
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible text input', () => {
      const { getByPlaceholderText } = render(<ChatInputBar {...defaultProps} />);
      
      const input = getByPlaceholderText('메시지를 입력해주세요');
      expect(input).toBeTruthy();
    });

    it('should have placeholder text for accessibility', () => {
      const { getByPlaceholderText } = render(<ChatInputBar {...defaultProps} />);
      
      expect(getByPlaceholderText('메시지를 입력해주세요')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<ChatInputBar {...defaultProps} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = render(<ChatInputBar {...defaultProps} message="" />);

      for (let i = 0; i < 20; i++) {
        rerender(<ChatInputBar {...defaultProps} message={`Message ${i}`} />);
      }

      expect(true).toBe(true); // Should not crash
    });
  });

  describe('Integration', () => {
    it('should handle complete user flow: type and send', () => {
      const onMessageChange = jest.fn();
      const onSend = jest.fn();
      
      const { getByPlaceholderText, UNSAFE_getByType } = render(
        <ChatInputBar
          {...defaultProps}
          message="Test message"
          onMessageChange={onMessageChange}
          onSend={onSend}
          isChatModalVisible={true}
        />
      );

      // Type message
      const input = getByPlaceholderText('메시지를 입력해주세요');
      fireEvent.changeText(input, 'Hello');
      expect(onMessageChange).toHaveBeenCalledWith('Hello');

      // Send message
      const FontAwesome = require('@expo/vector-icons').FontAwesome;
      const sendIcon = UNSAFE_getByType(FontAwesome);
      fireEvent.press(sendIcon.parent);
      expect(onSend).toHaveBeenCalled();
    });
  });
});