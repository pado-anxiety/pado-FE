import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import { Text, View } from '@src/components/ui';

const EASE_OUT_CUBIC = Easing.bezier(0.215, 0.61, 0.355, 1);

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
        entering={FadeIn.duration(400).easing(EASE_OUT_CUBIC)}
        exiting={FadeOut.duration(400).easing(EASE_OUT_CUBIC)}
        className="items-center"
      >
        <Text
          preset="heading"
          bold
          className="rounded-2xl bg-black/50 px-4 py-3 text-center text-white"
        >
          {breathText}
        </Text>
        {timer > 0 && (
          <Text
            preset="heading"
            bold
            className="mt-6 rounded-2xl bg-black/50 px-4 py-3 text-white"
          >
            {timer}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}
