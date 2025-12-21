import { Text, View } from '@src/components/ui';

import type { CBTRecommendation } from '../../types';

const SYMPTOM_OPTIONS = {
  BODY: '신체 반응',
  MIND: '심리 불안',
} as const;

const INTENSITY_OPTIONS = {
  1: '가벼움',
  2: '신경 쓰임',
  3: '꽤 힘듦',
  4: '심한 괴로움',
  5: '견디기 힘듦',
} as const;

const TRIGGER_OPTIONS = {
  PRESENTATION_EXAM: '발표/시험',
  RELATIONSHIP: '인간관계',
  HEALTH_DEATH: '건강/죽음',
  FUTURE_MONEY: '미래/돈',
  UNKNOWN: '이유 없이 불안',
} as const;

interface CBTRecommendationBoxProps {
  chat: CBTRecommendation;
}

export default function CBTRecommendationBox({
  chat,
}: CBTRecommendationBoxProps) {
  const { intensity, situation, symptom } = chat.options;

  return (
    <View className="flex flex-col items-start bg-chat-user rounded-xl p-4 self-end gap-2">
      <Text className="text-body-medium text-neutral-400">
        {`${chat.time}`}
      </Text>
      <View className="flex flex-row items-center gap-2">
        <Text className="text-body-medium text-white bg-neutral-650 rounded-md p-2">
          {`${SYMPTOM_OPTIONS[symptom as keyof typeof SYMPTOM_OPTIONS]}`}
        </Text>
        <Text className="text-body-medium text-white bg-neutral-650 rounded-md p-2">
          {`${INTENSITY_OPTIONS[intensity as keyof typeof INTENSITY_OPTIONS]}`}
        </Text>
        <Text className="text-body-medium text-white bg-neutral-650 rounded-md p-2">
          {`${TRIGGER_OPTIONS[situation as keyof typeof TRIGGER_OPTIONS]}`}
        </Text>
      </View>
    </View>
  );
}
