import { useCallback } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { BackHandler } from 'react-native';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';
import { getOceanColors } from '@src/lib/theme';

import ChatList from './components/ChatContainer/ChatList';
import { CHAT_MESSAGES } from './constants';
import { useChat, useChatKeyboard } from './hooks';

interface ChatContentAreaProps {
  onBack: () => void;
}

export default function ChatContentArea({ onBack }: ChatContentAreaProps) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const oceanColors = getOceanColors(scheme);

  const { input, list, handlers } = useChat();
  const { inputAnimatedStyle } = useChatKeyboard();

  const handleBack = useCallback(() => {
    input.blurInput();
    onBack();
  }, [input, onBack]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleBack();
          return true;
        },
      );
      return () => subscription.remove();
    }, [handleBack]),
  );

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: oceanColors.frontWave }}
    >
      <View className="flex-1 px-4">
        <ChatList
          list={list}
          input={input}
          recommandationModalHeight={0}
        />
      </View>

      <Animated.View
        style={[{ backgroundColor: oceanColors.frontWave }, inputAnimatedStyle]}
        className="px-4"
      >
        <View
          className="flex flex-row items-center justify-center gap-2 rounded-full border border-solid border-chat px-1 py-1"
          style={{ backgroundColor: tokens['--chat-input-bg'] }}
        >
          <View className="flex-1 justify-center">
            <TextInput
              ref={input.inputRef}
              className="grow rounded-xl bg-chat-input px-4 text-white focus:border-input-focus"
              style={{ fontSize: 17, height: 30 }}
              placeholder={CHAT_MESSAGES.INPUT_PLACEHOLDER}
              placeholderTextColor={tokens['--chat-placeholder']}
              onFocus={handlers.handleInputFocus}
              value={input.message}
              onChangeText={input.setMessage}
              textAlignVertical="center"
            />
          </View>
          <Pressable
            onPress={handlers.handleSend}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons
              name="send"
              size={ICONS_SIZE.medium}
              color={
                input.message.length > 0
                  ? tokens['--chat-icon-active']
                  : tokens['--chat-icon-default']
              }
              className="pr-4"
            />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
