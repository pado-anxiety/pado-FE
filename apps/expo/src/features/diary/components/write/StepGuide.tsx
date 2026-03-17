import Animated, { FadeIn } from 'react-native-reanimated';

import { Text } from '@src/components/ui';

interface StepGuideProps {
  badge: string;
  question: string;
  hint: string;
  accentColor: string;
  /** Used as Animated.View key to trigger enter animation */
  animationKey: string;
}

export function StepGuide({
  badge,
  question,
  hint,
  accentColor,
  animationKey,
}: StepGuideProps) {
  return (
    <Animated.View
      key={animationKey}
      entering={FadeIn.duration(250)}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: accentColor,
        paddingLeft: 16,
        gap: 6,
      }}
    >
      <Text
        preset="caption"
        bold
        style={{ color: accentColor }}
      >
        {badge}
      </Text>
      <Text
        preset="heading"
        bold
      >
        {question}
      </Text>
      <Text
        preset="sub"
        className="text-sub"
      >
        {hint}
      </Text>
    </Animated.View>
  );
}
