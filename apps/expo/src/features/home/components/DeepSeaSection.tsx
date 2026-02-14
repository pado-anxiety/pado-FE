import Animated, { FadeIn } from 'react-native-reanimated';

import { View } from '@src/components/ui';

import { ActList } from './Act/ActList';

export function DeepSeaSection(): React.ReactNode {
  return (
    <Animated.View
      entering={FadeIn.delay(1000).duration(1000)}
      className="bg-ocean-deep flex-1"
    >
      <View className="relative z-10 flex-1 items-center">
        <ActList />
      </View>
    </Animated.View>
  );
}
