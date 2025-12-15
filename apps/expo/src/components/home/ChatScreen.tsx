import { useCallback, useRef, useState } from 'react';

import { KeyboardAvoidingView, Pressable } from '@src/components/ui';
import { TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatInputBar from './ChatInputBar';
import ChatList, { Chat } from './ChatList';
import ChatModalHeader from './ChatModalHeader';
import ChatOverlay from './ChatOverlay';

const chatMockData = [
  {
    sender: 'AI',
    message: '안녕 나는 냥토닥이야',
    time: '12:00',
  },
  {
    sender: 'AI',
    message: '오늘은 무슨 일이 있었어?',
    time: '12:01',
  },
  {
    sender: 'AI',
    message: '지금 감정이 어떤지 나에게 알려줘',
    time: '12:02',
  },
  {
    sender: 'USER',
    message:
      '학교에서 친구들과 싸웠어. 그런데 나는 친구들을 미워해. 어떻게 해야할까? 나는 다시 화해하고 싶어. 근데 너무 불안하고 화가 나',
    time: '12:03',
  },
  {
    sender: 'AI',
    message: '그랬구나',
    time: '12:04',
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>(chatMockData as Chat[]);

  const handleBack = useCallback(() => {
    setIsChatModalVisible(false);
    inputRef.current?.blur();
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsChatModalVisible(true);
  }, []);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;

    inputRef.current?.clear();
    inputRef.current?.blur();
    setChats((prev) => [
      ...prev,
      { sender: 'USER', message, time: new Date().toISOString() },
    ]);
    setMessage('');
  }, [message]);

  return (
    <>
      <ChatOverlay visible={isChatModalVisible} />

      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
      >
        <Pressable
          className="flex flex-1 flex-col items-center justify-end"
          onPress={() => inputRef.current?.blur()}
        >
          {isChatModalVisible && (
            <>
              <ChatModalHeader onBack={handleBack} />
              <ChatList chats={chats} />
            </>
          )}

          <ChatInputBar
            ref={inputRef}
            message={message}
            onMessageChange={setMessage}
            onFocus={handleInputFocus}
            onSend={handleSend}
            paddingBottom={insets.bottom} // TODO: 키보드 내려갔을 때 패딩 조절
          />
        </Pressable>
      </KeyboardAvoidingView>
    </>
  );
}
