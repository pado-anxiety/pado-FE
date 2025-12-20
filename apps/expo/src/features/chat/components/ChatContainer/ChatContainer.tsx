import { useState } from 'react';

import { Button, Text, View } from '@src/components/ui';
import Animated from 'react-native-reanimated';

import { useChatKeyboard } from '../../hooks';
import { UseChatReturn } from '../../hooks/useChat';
import ChatInputBar from './ChatInputBar';
import ChatList from './ChatList';

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

export default function ChatContainer({
  list,
  input,
  handlers,
}: UseChatReturn) {
  const {
    cbtRecommendation,
    rejectCBTRecommendation,
    acceptCBTRecommendation,
  } = input;
  const isCBTRecommendation = !!cbtRecommendation;

  const { inputAnimatedStyle } = useChatKeyboard();

  const [recommandationModalHeight, setRecommandationModalHeight] = useState(0);

  return (
    <Animated.View
      className="flex flex-1 flex-col justify-end px-4"
      style={[inputAnimatedStyle]}
    >
      <View className="relative flex-1">
        <ChatList
          list={list}
          input={input}
          recommandationModalHeight={recommandationModalHeight}
        />
        {isCBTRecommendation && (
          <View
            className="w-full bg-neutral-200 rounded-2xl p-6 absolute bottom-0 left-0 right-0"
            onLayout={(e) => {
              const newHeight = e.nativeEvent.layout.height;
              setRecommandationModalHeight((prev) =>
                prev === newHeight ? prev : newHeight,
              );
            }}
          >
            <Text className="text-body-large text-primary font-medium text-start mb-3">
              {CBT_LABELS[cbtRecommendation]}을 해보시겠어요?
            </Text>
            <View className="flex flex-row gap-3">
              <View className="flex-1">
                <Button
                  text="괜찮아요"
                  color="secondary"
                  size="default"
                  onPress={rejectCBTRecommendation}
                  className="bg-neutral-300 border-[0.5px] border-neutral-400"
                />
              </View>
              <View className="flex-1">
                <Button
                  text="좋아요"
                  color="primary"
                  size="default"
                  onPress={() => acceptCBTRecommendation(cbtRecommendation)}
                  className="bg-neutral-800 border-[0.5px] border-neutral-500"
                />
              </View>
            </View>
          </View>
        )}
      </View>
      <ChatInputBar
        input={input}
        handlers={handlers}
      />
    </Animated.View>
  );
}
