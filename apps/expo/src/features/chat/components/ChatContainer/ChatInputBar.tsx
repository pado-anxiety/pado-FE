import { Ionicons } from '@expo/vector-icons';
import { View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { useChatModal } from '../../context';
import { ChatHandlers, ChatInputState } from '../../hooks/useChat';

interface ChatInputBarProps {
  input: ChatInputState;
  handlers: ChatHandlers;
}

export default function ChatInputBar({ input, handlers }: ChatInputBarProps) {
  const {
    inputRef,
    message,
    setMessage,
    cbtRecommendation,
    getCBTRecommendation,
  } = input;
  const isCBTRecommendation = !!cbtRecommendation;

  const { handleInputFocus, handleSend } = handlers;

  const { isChatModalVisible, openModal } = useChatModal();

  const handlePress = async () => {
    if (isChatModalVisible) return;

    openModal();
    await new Promise((resolve) => setTimeout(resolve, 500));
    inputRef?.current?.focus();
  };

  return (
    <Pressable
      className="flex flex-row items-center 
      justify-center gap-2 mt-4 border-input 
      border-neutral-700
      border-solid border rounded-full
      focus:border-neutral-600 py-1 px-1"
      style={{
        backgroundColor: 'rgba(65, 65, 65, 0.9)',
        opacity: isCBTRecommendation ? 0.5 : 1,
      }}
      onPress={handlePress}
      pointerEvents={
        !(isChatModalVisible && isCBTRecommendation) ? 'auto' : 'none'
      }
    >
      <Pressable
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={() => {
          if (!isChatModalVisible) return;

          getCBTRecommendation();
        }}
        className="bg-neutral-600 aspect-square rounded-full p-3"
      >
        <Ionicons
          name="sparkles"
          size={ICONS_SIZE.medium}
          color="rgb(238, 238, 238)"
        />
      </Pressable>
      <View
        className="flex-1 justify-center"
        pointerEvents={isChatModalVisible ? 'auto' : 'none'}
      >
        <TextInput
          ref={inputRef}
          className="bg-chat-input rounded-xl px-2 text-white grow focus:border-input-focus"
          style={{ fontSize: 17, height: 30 }}
          placeholder="메시지를 입력해주세요"
          placeholderTextColor="rgba(255, 255, 255, 0.50)"
          onFocus={handleInputFocus}
          value={message}
          onChangeText={setMessage}
          textAlignVertical="center"
        />
      </View>
      <Pressable
        onPress={handleSend}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons
          name="send"
          size={ICONS_SIZE.medium}
          color={
            message.length > 0
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(255, 255, 255, 0.5)'
          }
          className="pr-4"
        />
      </Pressable>
    </Pressable>
  );
}
