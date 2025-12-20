import { Text, View } from '@src/components/ui';

import type { CBTRecommendation } from '../../types';

interface CBTRecommendationBoxProps {
  chat: CBTRecommendation;
}

export default function CBTRecommendationBox({
  chat,
}: CBTRecommendationBoxProps) {
  const { intensity, situation, symptom } = chat.options;

  return (
    <View className="flex flex-col items-start bg-chat-user rounded-xl p-4 self-end gap-2">
      <Text className="text-body-small text-white">이전 CBT 추천 기록</Text>
      <View className="flex flex-row items-center gap-2">
        <Text className="text-body-small text-white bg-neutral-650 rounded-md p-2">
          {`${intensity}`}
        </Text>
        <Text className="text-body-small text-white bg-neutral-650 rounded-md p-2">
          {`${situation}`}
        </Text>
        <Text className="text-body-small text-white bg-neutral-650 rounded-md p-2">
          {`${symptom}`}
        </Text>
      </View>
    </View>
  );
}
