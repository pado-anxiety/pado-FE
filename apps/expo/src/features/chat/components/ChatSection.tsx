import { useCallback, useEffect, useRef } from 'react';

import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { NavButton, Pressable, Text, View } from '@src/components/ui';
import { PageType } from '@src/features/home/types';
import { triggerHaptic } from '@src/lib/haptics';
import { ICONS_SIZE } from '@src/lib/styles';

import { useChatInput } from '../hooks/useChatInput';
import { useChatQuery } from '../hooks/useChatQuery';
import { useChatQuota } from '../hooks/useChatQuota';
import { ChatBubbleAssistant } from './ChatBubbleAssistant';
import { ChatBubbleUser } from './ChatBubbleUser';
import { ChatInput } from './ChatInput';
import { ChatLoadingBubble } from './ChatLoadingBubble';

interface ChatSectionProps {
  setPage: (page: PageType) => void;
}

const HEADER_HEIGHT = 48;

export function ChatSection({ setPage }: ChatSectionProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const {
    chatItems,
    isSending,
    sendStatus,
    sendMessage,
    loadOlderMessages,
    hasOlderMessages,
    isLoadingOlder,
  } = useChatQuery({ enabled: true });
  const input = useChatInput();
  const { remainingQuota } = useChatQuota();

  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  const handleSend = useCallback(() => {
    if (!input.message.trim()) return;
    sendMessage(input.message);
    input.clear();
  }, [input, sendMessage]);

  useEffect(() => {
    if (sendStatus === 'pending' || sendStatus === 'success') {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [sendStatus]);

  const handleScrollBeginDrag = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      if (
        hasOlderMessages &&
        !isLoadingOlder &&
        e.nativeEvent.contentOffset.y <= 0
      ) {
        loadOlderMessages();
      }
    },
    [hasOlderMessages, isLoadingOlder, loadOlderMessages],
  );

  return (
    <Animated.View
      style={StyleSheet.absoluteFill}
      entering={FadeIn.delay(500)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={-insets.bottom}
        pointerEvents="box-none"
      >
        {/* 헤더: normal flow — ScrollView가 헤더 아래에서 시작 */}
        <View
          style={{
            paddingTop: insets.top + scale(8),
            paddingHorizontal: 24,
          }}
          pointerEvents="box-none"
        >
          <View
            style={{
              height: HEADER_HEIGHT,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <NavButton
              variant="chevron"
              size="small"
              color="#FFFFFF"
              onPress={() => {
                triggerHaptic('NAVIGATE');
                setPage('HOME');
              }}
            />
            <Pressable hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <View className="flex flex-row items-center justify-center gap-1.5 rounded-full bg-chat-user px-3 py-1.5">
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
        </View>

        {/* 메시지 영역 — 헤더 아래에서 시작, 메시지가 헤더 위로 넘치지 않음 */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: 8,
          }}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={handleScrollBeginDrag}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        >
          {isLoadingOlder && (
            <View className="items-center py-4">
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            </View>
          )}
          {chatItems.map((item) =>
            item.sender === 'USER' ? (
              <ChatBubbleUser
                key={item.id}
                item={item}
              />
            ) : (
              <ChatBubbleAssistant
                key={item.id}
                item={item}
              />
            ),
          )}
          {isSending && <ChatLoadingBubble />}
        </ScrollView>

        {/* 하단 입력 */}
        <ChatInput
          input={input}
          onSend={handleSend}
          onFocus={handleInputFocus}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
