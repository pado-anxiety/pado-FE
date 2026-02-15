import Animated, { FadeIn } from 'react-native-reanimated';

import { View } from '@src/components/ui';

import { ActList } from './Act/ActList';

interface DeepSeaSectionProps {
  onContentHeight?: (height: number) => void;
}

export function DeepSeaSection({
  onContentHeight,
}: DeepSeaSectionProps): React.ReactNode {
  return (
    <Animated.View
      entering={FadeIn.delay(1000).duration(500)}
      className="flex-1"
    >
      <View className="relative z-10 flex-1 items-center">
        <ActList onContentHeight={onContentHeight} />
      </View>
    </Animated.View>
  );
}
