import { Pressable } from '@src/components/ui';
import Animated from 'react-native-reanimated';

import {
  ChatInputBar,
  ChatList,
  ChatModalHeader,
  ChatOverlay,
} from './components';
import { useChat, useChatKeyboard } from './hooks';

export default function ChatScreen() {
  const {
    inputRef,
    flatListRef,
    isChatModalVisible,
    message,
    chats,
    setMessage,
    handleBack,
    handleInputFocus,
    handleSend,
    setIsChatModalVisible,
  } = useChat();

  const { inputAnimatedStyle } = useChatKeyboard();

  return (
    <>
      <ChatOverlay visible={isChatModalVisible} />

      <Pressable
        className="flex flex-1 flex-col justify-end w-full"
        onPress={() => inputRef.current?.blur()}
      >
        {isChatModalVisible && <ChatModalHeader onBack={handleBack} />}

        <Animated.View
          className="flex flex-1 flex-col justify-end px-4"
          style={[inputAnimatedStyle]}
        >
          {isChatModalVisible && (
            <ChatList
              ref={flatListRef}
              chats={chats}
            />
          )}
          <ChatInputBar
            ref={inputRef}
            message={message}
            onMessageChange={setMessage}
            onFocus={handleInputFocus}
            onSend={handleSend}
            isChatModalVisible={isChatModalVisible}
            setIsChatModalVisible={setIsChatModalVisible}
          />
        </Animated.View>
      </Pressable>
    </>
  );
}
