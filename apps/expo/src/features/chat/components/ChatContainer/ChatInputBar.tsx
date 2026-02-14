import { useRef } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';
import { View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';

import { CHAT_MESSAGES } from '../../constants';
import { useChatModal } from '../../context';
import { ChatHandlers, ChatInputState } from '../../hooks/useChat';
import { CBTRecommendModal } from '../CBTRecommendModal';

interface ChatInputBarProps {
  input: ChatInputState;
  handlers: ChatHandlers;
}

export default function ChatInputBar({ input, handlers }: ChatInputBarProps) {
  const {
    blurInput,
    inputRef,
    message,
    setMessage,
    cbtRecommendation,
    getCBTRecommendation,
  } = input;
  const isCBTRecommendation = !!cbtRecommendation;

  const { handleInputFocus, handleSend } = handlers;
  const { colorScheme } = useColorScheme();
  const tokens = colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  const cbtModalRef = useRef<BottomSheetModal>(null);
  const { isChatModalVisible, openModal: openChatModal } = useChatModal();

  const openCBTModal = () => {
    blurInput();
    cbtModalRef.current?.present();
  };

  const handlePress = async () => {
    if (isChatModalVisible) return;

    openChatModal();
    await new Promise((resolve) => setTimeout(resolve, 500));
    inputRef?.current?.focus();
  };

  return (
    <Pressable
      className="flex flex-row items-center
      justify-center gap-2 mt-4
      border-chat border-solid border rounded-full
      py-1 px-1"
      style={{
        backgroundColor: tokens['--chat-input-bg'],
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

          openCBTModal();
        }}
        className="bg-chat-user aspect-square rounded-full p-3"
      >
        <Ionicons
          name="sparkles"
          size={ICONS_SIZE.medium}
          color={tokens['--chat-icon-default']}
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
          placeholder={CHAT_MESSAGES.INPUT_PLACEHOLDER}
          placeholderTextColor={tokens['--chat-placeholder']}
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
              ? tokens['--chat-icon-active']
              : tokens['--chat-icon-default']
          }
          className="pr-4"
        />
      </Pressable>
      <CBTRecommendModal
        modalRef={cbtModalRef}
        onComplete={getCBTRecommendation}
      />
    </Pressable>
  );
}
