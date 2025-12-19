import { useState } from 'react';

import { Button, Pressable, Text, View } from '@src/components/ui';
import Animated from 'react-native-reanimated';

import {
  ChatInputBar,
  ChatList,
  ChatModalHeader,
  ChatOverlay,
} from './components';
import { useChat, useChatKeyboard } from './hooks';

type CBTType =
  | 'BREATHING'
  | 'CALMING_PHRASE'
  | 'GROUNDING'
  | 'COGNITIVE_REFRAME';

const CBT_LABELS: Record<CBTType, string> = {
  BREATHING: '호흡 운동',
  CALMING_PHRASE: '진정 문구',
  GROUNDING: '그라운딩',
  COGNITIVE_REFRAME: '인지 재구성',
};

export default function ChatScreen() {
  const { input, list, modal, handlers } = useChat();
  const { inputAnimatedStyle } = useChatKeyboard();

  const [recommandationModalHeight, setRecommandationModalHeight] = useState(0);

  return (
    <>
      <ChatOverlay visible={modal.isChatModalVisible} />

      <Pressable
        className="flex flex-1 flex-col justify-end w-full"
        onPress={() => input.inputRef.current?.blur()}
      >
        {modal.isChatModalVisible && (
          <ChatModalHeader onBack={handlers.handleBack} />
        )}

        <Animated.View
          className="flex flex-1 flex-col justify-end px-4"
          style={[inputAnimatedStyle]}
        >
          <View className="relative flex-1">
            {modal.isChatModalVisible && (
              <ChatList
                ref={list.flatListRef}
                chats={list.chats}
                isChatLoading={list.isChatLoading}
                recommandationModalHeight={recommandationModalHeight}
                isRecommandationModalVisible={!!input.cbtRecommendation}
              />
            )}
            {input.cbtRecommendation && (
              <View
                className="w-full bg-red-100 rounded-2xl p-5 absolute bottom-0 left-0 right-0"
                onLayout={(e) =>
                  setRecommandationModalHeight(e.nativeEvent.layout.height)
                }
              >
                <Text className="text-body text-primary font-medium text-center mb-4">
                  {CBT_LABELS[input.cbtRecommendation]}을 해보시겠어요?
                </Text>
                <View className="flex flex-row gap-3">
                  <View className="flex-1">
                    <Button
                      text="괜찮아요"
                      color="secondary"
                      size="sm"
                      onPress={() => console.log('reject')}
                    />
                  </View>
                  <View className="flex-1">
                    <Button
                      text="좋아요"
                      color="primary"
                      size="sm"
                      onPress={() => console.log('accept')}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <ChatInputBar
            ref={input.inputRef}
            message={input.message}
            onMessageChange={input.setMessage}
            onFocus={handlers.handleInputFocus}
            onSend={handlers.handleSend}
            isChatModalVisible={modal.isChatModalVisible}
            setIsChatModalVisible={modal.setIsChatModalVisible}
            getCBTRecommendation={input.getCBTRecommendation}
            isRecommandationModalVisible={!!input.cbtRecommendation}
          />
        </Animated.View>
      </Pressable>
    </>
  );
}
