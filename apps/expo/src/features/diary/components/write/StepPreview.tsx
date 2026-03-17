import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Text } from '@src/components/ui';

interface StepPreviewProps {
  label: string;
  value: string;
}

export function StepPreview({ label, value }: StepPreviewProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      className="border-l-2 border-default pl-4"
      style={{ gap: 2 }}
    >
      <Text
        preset="caption"
        bold
        className="text-sub"
      >
        {label}
      </Text>
      <Text
        preset="sub"
        className="text-sub"
        numberOfLines={2}
      >
        {value}
      </Text>
    </Animated.View>
  );
}
