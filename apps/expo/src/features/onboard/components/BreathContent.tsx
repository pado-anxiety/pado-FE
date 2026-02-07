import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Text, View } from '@src/components/ui';

interface BreathContentProps {
  /** 호흡 안내 텍스트 */
  breathText: string;
  /** 남은 시간 (초) */
  timer: number;
}

/**
 * 호흡 운동 중 표시되는 컨텐츠
 */
export function BreathContent({ breathText, timer }: BreathContentProps) {
  // 텍스트가 없으면 아무것도 표시하지 않음
  if (!breathText) {
    return <View className="flex-1" />;
  }

  return (
    <View className="flex-1 items-center px-8">
      <Animated.View
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
        className="items-center"
      >
        <Text
          className="rounded-2xl bg-black/50 px-4 py-3 text-center text-white"
          size="title-medium"
          weight="bold"
        >
          {breathText}
        </Text>
        {timer > 0 && (
          <Text
            className="mt-6 rounded-2xl bg-black/50 px-4 py-3 text-white"
            weight="heavy"
            style={{ fontSize: 48 }}
          >
            {timer}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}
