import Animated, { LinearTransition } from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';

import { ActList } from './Act/ActList';

export function DeepSeaSection(): React.ReactNode {
  return (
    <Animated.View
      layout={LinearTransition.duration(1000)}
      className="flex-1 bg-[#003366] items-center z-10"
      style={{ marginTop: -scale(10) }}
    >
      <ActList />
    </Animated.View>
  );
}
