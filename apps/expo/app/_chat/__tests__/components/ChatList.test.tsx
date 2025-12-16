import React from 'react';
import { render } from '@testing-library/react-native';
import ChatList from '../../components/ChatList';
import { ROLE } from '../../constants';
import type { Chat } from '../../types';

// Mock the parseChats utility
jest.mock('../../utils/parseChats', () => ({
  parseChats: jest.fn((chats) => {
    // Simple mock implementation
    const stack = [];
    for (const chat of chats) {
      if (chat.sender === 'USER') {
        stack.push(chat);
      } else {
        const lastItem = stack[stack.length - 1];
        if (!lastItem || lastItem.sender === 'USER') {
          stack.push({
            sender: 'AI',
            messages: [chat.message],
            time: chat.time,
          });
        } else {
          lastItem.messages.unshift(chat.message);
        }
      }
    }
    return stack;
  }),
}));

// Mock child components
jest.mock('../../components/ChatItem', () => ({
  AssistantChatBox: ({ chat }: any) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return (
      <View testID="assistant-chat-box">
        <Text>{chat.messages.join(' | ')}</Text>
      </View>
    );
  },
  UserChatBox: ({ chat }: any) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return (
      <View testID="user-chat-box">
        <Text>{chat.message}</Text>
      </View>
    );
  },
}));

describe('ChatList', () => {
  const mockRef = { current: null } as React.RefObject<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ChatList ref={mockRef} chats={[]} />);
      expect(container).toBeTruthy();
    });

    it('should render empty list when no chats provided', () => {
      const { queryByTestId } = render(<ChatList ref={mockRef} chats={[]} />);
      
      expect(queryByTestId('user-chat-box')).toBeNull();
      expect(queryByTestId('assistant-chat-box')).toBeNull();
    });

    it('should render user chat messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Hello', time: '12:00' },
      ];

      const { getByTestId, getByText } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      expect(getByTestId('user-chat-box')).toBeTruthy();
      expect(getByText('Hello')).toBeTruthy();
    });

    it('should render AI chat messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Hi there', time: '12:01' },
      ];

      const { getByTestId, getByText } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      expect(getByTestId('assistant-chat-box')).toBeTruthy();
      expect(getByText('Hi there')).toBeTruthy();
    });

    it('should render multiple chat messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Hello', time: '12:00' },
        { sender: ROLE.AI, message: 'Hi', time: '12:01' },
        { sender: ROLE.USER, message: 'How are you?', time: '12:02' },
      ];

      const { getAllByTestId } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const userChats = getAllByTestId('user-chat-box');
      const aiChats = getAllByTestId('assistant-chat-box');

      expect(userChats.length).toBe(2);
      expect(aiChats.length).toBe(1);
    });

    it('should render grouped AI messages correctly', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'First', time: '12:00' },
        { sender: ROLE.AI, message: 'Second', time: '12:01' },
        { sender: ROLE.AI, message: 'Third', time: '12:02' },
      ];

      const { getByText } = render(<ChatList ref={mockRef} chats={chats} />);

      // Grouped messages are joined with ' | ' in our mock
      expect(getByText('First | Second | Third')).toBeTruthy();
    });
  });

  describe('ParseChats Integration', () => {
    it('should call parseChats with provided chats', () => {
      const parseChats = require('../../utils/parseChats').parseChats;
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      render(<ChatList ref={mockRef} chats={chats} />);

      expect(parseChats).toHaveBeenCalledWith(chats);
    });

    it('should memoize parseChats result based on chats', () => {
      const parseChats = require('../../utils/parseChats').parseChats;
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      const { rerender } = render(<ChatList ref={mockRef} chats={chats} />);

      expect(parseChats).toHaveBeenCalledTimes(1);

      // Rerender with same chats
      rerender(<ChatList ref={mockRef} chats={chats} />);

      // Should still be called only once due to useMemo
      expect(parseChats).toHaveBeenCalledTimes(1);
    });

    it('should recalculate parseChats when chats change', () => {
      const parseChats = require('../../utils/parseChats').parseChats;
      const chats1: Chat[] = [
        { sender: ROLE.USER, message: 'Test 1', time: '12:00' },
      ];
      const chats2: Chat[] = [
        { sender: ROLE.USER, message: 'Test 2', time: '12:01' },
      ];

      const { rerender } = render(<ChatList ref={mockRef} chats={chats1} />);

      expect(parseChats).toHaveBeenCalledWith(chats1);

      // Rerender with different chats
      rerender(<ChatList ref={mockRef} chats={chats2} />);

      expect(parseChats).toHaveBeenCalledWith(chats2);
      expect(parseChats).toHaveBeenCalledTimes(2);
    });
  });

  describe('FlatList Properties', () => {
    it('should configure FlatList with inverted prop', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      const { UNSAFE_getByType } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const FlatList = require('react-native-gesture-handler').FlatList;
      const flatList = UNSAFE_getByType(FlatList);

      expect(flatList.props.inverted).toBe(true);
    });

    it('should hide vertical scroll indicator', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      const { UNSAFE_getByType } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const FlatList = require('react-native-gesture-handler').FlatList;
      const flatList = UNSAFE_getByType(FlatList);

      expect(flatList.props.showsVerticalScrollIndicator).toBe(false);
    });

    it('should disable bounce', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      const { UNSAFE_getByType } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const FlatList = require('react-native-gesture-handler').FlatList;
      const flatList = UNSAFE_getByType(FlatList);

      expect(flatList.props.bounces).toBe(false);
    });

    it('should set overScrollMode to never', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      const { UNSAFE_getByType } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const FlatList = require('react-native-gesture-handler').FlatList;
      const flatList = UNSAFE_getByType(FlatList);

      expect(flatList.props.overScrollMode).toBe('never');
    });
  });

  describe('Chat Alignment', () => {
    it('should align user messages to the right', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      const { getByTestId } = render(<ChatList ref={mockRef} chats={chats} />);

      const userChatBox = getByTestId('user-chat-box');
      const parent = userChatBox.parent;

      // Check if parent has self-end class (aligned to right)
      expect(parent?.props.className).toContain('self-end');
    });

    it('should align AI messages to the left', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Test', time: '12:00' },
      ];

      const { getByTestId } = render(<ChatList ref={mockRef} chats={chats} />);

      const aiChatBox = getByTestId('assistant-chat-box');
      const parent = aiChatBox.parent;

      // Check if parent has self-start class (aligned to left)
      expect(parent?.props.className).toContain('self-start');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message strings', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: '', time: '12:00' },
      ];

      const { getByTestId } = render(<ChatList ref={mockRef} chats={chats} />);

      expect(getByTestId('user-chat-box')).toBeTruthy();
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(1000);
      const chats: Chat[] = [
        { sender: ROLE.USER, message: longMessage, time: '12:00' },
      ];

      const { getByText } = render(<ChatList ref={mockRef} chats={chats} />);

      expect(getByText(longMessage)).toBeTruthy();
    });

    it('should handle special characters in messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: '<>&"\'', time: '12:00' },
      ];

      const { getByText } = render(<ChatList ref={mockRef} chats={chats} />);

      expect(getByText('<>&"\'')).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: '안녕하세요 😀', time: '12:00' },
      ];

      const { getByText } = render(<ChatList ref={mockRef} chats={chats} />);

      expect(getByText('안녕하세요 😀')).toBeTruthy();
    });

    it('should handle a large number of messages', () => {
      const chats: Chat[] = Array.from({ length: 100 }, (_, i) => ({
        sender: i % 2 === 0 ? ROLE.USER : ROLE.AI,
        message: `Message ${i}`,
        time: `12:${i.toString().padStart(2, '0')}`,
      }));

      const { container } = render(<ChatList ref={mockRef} chats={chats} />);

      expect(container).toBeTruthy();
    });
  });

  describe('Ref Handling', () => {
    it('should accept ref prop', () => {
      const ref = React.createRef<any>();
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      render(<ChatList ref={ref} chats={chats} />);

      // Ref should be defined (actual behavior depends on FlatList implementation)
      expect(ref).toBeDefined();
    });

    it('should handle null ref', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      expect(() => {
        render(<ChatList ref={mockRef} chats={chats} />);
      }).not.toThrow();
    });
  });

  describe('Key Extraction', () => {
    it('should use index as key for list items', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test 1', time: '12:00' },
        { sender: ROLE.USER, message: 'Test 2', time: '12:01' },
      ];

      const { UNSAFE_getByType } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const FlatList = require('react-native-gesture-handler').FlatList;
      const flatList = UNSAFE_getByType(FlatList);

      const keyExtractor = flatList.props.keyExtractor;
      expect(keyExtractor({}, 0)).toBe('0');
      expect(keyExtractor({}, 5)).toBe('5');
    });
  });

  describe('Content Container Style', () => {
    it('should have correct content container style', () => {
      const chats: Chat[] = [
        { sender: ROLE.USER, message: 'Test', time: '12:00' },
      ];

      const { UNSAFE_getByType } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const FlatList = require('react-native-gesture-handler').FlatList;
      const flatList = UNSAFE_getByType(FlatList);

      expect(flatList.props.contentContainerStyle).toEqual({
        flexGrow: 1,
        justifyContent: 'flex-start',
        gap: 16,
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle mixed conversation with alternating speakers', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Hello', time: '12:00' },
        { sender: ROLE.USER, message: 'Hi', time: '12:01' },
        { sender: ROLE.AI, message: 'How can I help?', time: '12:02' },
        { sender: ROLE.USER, message: 'I need info', time: '12:03' },
      ];

      const { getAllByTestId } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const userChats = getAllByTestId('user-chat-box');
      const aiChats = getAllByTestId('assistant-chat-box');

      expect(userChats.length).toBe(2);
      expect(aiChats.length).toBe(2);
    });

    it('should handle conversation with consecutive AI messages', () => {
      const chats: Chat[] = [
        { sender: ROLE.AI, message: 'Message 1', time: '12:00' },
        { sender: ROLE.AI, message: 'Message 2', time: '12:01' },
        { sender: ROLE.AI, message: 'Message 3', time: '12:02' },
        { sender: ROLE.USER, message: 'Thanks', time: '12:03' },
      ];

      const { getAllByTestId } = render(
        <ChatList ref={mockRef} chats={chats} />
      );

      const aiChats = getAllByTestId('assistant-chat-box');
      const userChats = getAllByTestId('user-chat-box');

      expect(aiChats.length).toBe(1); // Grouped into one
      expect(userChats.length).toBe(1);
    });
  });

  describe('Performance', () => {
    it('should handle rapid prop updates', () => {
      const chats1: Chat[] = [
        { sender: ROLE.USER, message: 'Test 1', time: '12:00' },
      ];
      const chats2: Chat[] = [
        { sender: ROLE.USER, message: 'Test 2', time: '12:01' },
      ];
      const chats3: Chat[] = [
        { sender: ROLE.USER, message: 'Test 3', time: '12:02' },
      ];

      const { rerender } = render(<ChatList ref={mockRef} chats={chats1} />);
      rerender(<ChatList ref={mockRef} chats={chats2} />);
      rerender(<ChatList ref={mockRef} chats={chats3} />);

      // Should not crash
      expect(true).toBe(true);
    });
  });
});