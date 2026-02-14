import { useCallback } from 'react';

import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { BackHandler } from 'react-native';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { NavButton, Text, View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';
import { getOceanColors } from '@src/lib/theme';

import { WaveHorizon } from '../home/components/Wave/WaveHorizon';
import ChatList from './components/ChatContainer/ChatList';
import { CHAT_MESSAGES } from './constants';
import { ChatModalProvider } from './context';
import { useChat, useChatKeyboard, useChatQuota } from './hooks';

interface ChatPageLayoutProps {
  onBack: () => void;
}

export default function ChatPageLayout({ onBack }: ChatPageLayoutProps) {
  return (
    <ChatModalProvider initialVisible>
      <ChatPageContent onBack={onBack} />
    </ChatModalProvider>
  );
}

function ChatPageContent({ onBack }: ChatPageLayoutProps) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const oceanColors = getOceanColors(scheme);
  const insets = useSafeAreaInsets();

  const { input, list, handlers } = useChat();
  const { inputAnimatedStyle } = useChatKeyboard();
  const { remainingQuota } = useChatQuota();

  const handleBack = useCallback(() => {
    input.blurInput();
    onBack();
  }, [input, onBack]);

  // Android 하드웨어 백버튼 처리
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
      style={{ backgroundColor: oceanColors.deep }}
    >
      {/* 헤더 */}
      <View
        className="flex flex-row items-center justify-between bg-page px-6"
        style={{ paddingTop: insets.top + 8, paddingBottom: 8 }}
      >
        <NavButton
          variant="chevron"
          size="large"
          onPress={handleBack}
        />
        <Pressable hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <View className="flex flex-row items-center justify-center gap-4 rounded-full bg-chat-user px-3 py-1.5">
            <FontAwesome
              name="send"
              size={ICONS_SIZE.small}
              color={tokens['--chat-border']}
            />
            <Text
              preset="body"
              className="text-chat-assistant"
            >
              {remainingQuota?.quota}/5
            </Text>
          </View>
        </Pressable>
      </View>

      {/* 파도 수평선 — mb-10 상쇄 */}
      <View style={{ marginBottom: -40 }}>
        <WaveHorizon />
      </View>

      {/* 채팅 영역 */}
      <View
        className="flex-1 px-4"
        style={{ backgroundColor: oceanColors.frontWave }}
      >
        <ChatList
          list={list}
          input={input}
          recommandationModalHeight={0}
        />
      </View>

      {/* 입력창 */}
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
