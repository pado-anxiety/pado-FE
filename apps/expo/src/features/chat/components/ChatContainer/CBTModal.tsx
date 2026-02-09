import { Dispatch, SetStateAction } from 'react';

import { Button, Text, View } from '@src/components/ui';

import { CHAT_MESSAGES } from '../../constants';
import { ChatInputState } from '../../hooks/useChat';

interface CBTModalProps {
  input: ChatInputState;
  setRecommandationModalHeight: Dispatch<SetStateAction<number>>;
}

export default function CBTModal({
  input,
  setRecommandationModalHeight,
}: CBTModalProps) {
  const {
    rejectCBTRecommendation,
    acceptCBTRecommendation,
    cbtRecommendation,
  } = input;

  return (
    <>
      <View
        className="w-full bg-neutral-200 rounded-2xl p-6 absolute bottom-0 left-0 right-0"
        onLayout={(e) => {
          const newHeight = e.nativeEvent.layout.height;
          setRecommandationModalHeight((prev: number) =>
            prev === newHeight ? prev : newHeight,
          );
        }}
      >
        <Text preset="heading" bold className="text-primary text-start mb-3">
          {
            CHAT_MESSAGES.CBT_TYPE_LABELS[
              cbtRecommendation as keyof typeof CHAT_MESSAGES.CBT_TYPE_LABELS
            ]
          }
          {CHAT_MESSAGES.CBT_RECOMMENDATION.QUESTION_SUFFIX}
        </Text>
        <View className="flex flex-row gap-3">
          <View className="flex-1">
            <Button
              text={CHAT_MESSAGES.CBT_RECOMMENDATION.BUTTON_REJECT}
              color="secondary"
              size="default"
              onPress={rejectCBTRecommendation}
              className="bg-neutral-300 border-[0.5px] border-neutral-400"
            />
          </View>
          <View className="flex-1">
            <Button
              text={CHAT_MESSAGES.CBT_RECOMMENDATION.BUTTON_ACCEPT}
              color="primary"
              size="default"
              onPress={() =>
                acceptCBTRecommendation(cbtRecommendation as string)
              }
              className="bg-neutral-800 border-[0.5px] border-neutral-500"
            />
          </View>
        </View>
      </View>
    </>
  );
}
