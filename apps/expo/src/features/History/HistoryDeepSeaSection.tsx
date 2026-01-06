import { Text, View } from '@src/components/ui';
import Animated, { FadeIn } from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';

export function HistoryDeepSeaSection(): React.ReactNode {
  return (
    <View
      className="flex-1 bg-[#003366] items-center z-10"
      style={{ marginTop: -scale(20) }}
    >
      <Animated.View entering={FadeIn.duration(1000)}>
        <Text className="text-2xl text-white font-medium">
          HistoryDeepSeaSection
        </Text>
      </Animated.View>
    </View>
  );
}
