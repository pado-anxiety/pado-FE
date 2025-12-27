import React from 'react';

import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { Text, View, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

const SKY_HEIGHT = scale(300);
const HORIZON_HEIGHT = scale(100);

const FREQUENCY = 2;
const AMPLITUDE = 15;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const clock = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) return;
    clock.value += frameInfo.timeSincePreviousFrame * 0.003;
  });

  const animatedPath = useDerivedValue(() => {
    const path = Skia.Path.Make();

    const verticalOffset = HORIZON_HEIGHT / 2;

    path.moveTo(0, verticalOffset);

    for (let x = 0; x <= width + 10; x += 10) {
      // y = A * sin(Bx + C) + D
      const angle = (x / width) * (Math.PI * FREQUENCY) + clock.value;
      const y = AMPLITUDE * Math.sin(angle) + verticalOffset;

      path.lineTo(x, y);
    }

    path.lineTo(width, HORIZON_HEIGHT + 10);
    path.lineTo(0, HORIZON_HEIGHT + 10);
    path.close();

    return path;
  }, [width]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Sky */}
        <View
          className="bg-white items-center justify-center"
          style={{
            height: SKY_HEIGHT,
            paddingTop: insets.top,
          }}
        >
          <Text>Sky</Text>
        </View>

        {/* Wave Horizon */}
        <Canvas
          style={{
            width: width,
            height: HORIZON_HEIGHT,
          }}
        >
          <Path
            path={animatedPath}
            color="#000080"
          />
        </Canvas>

        {/* Deep Sea */}
        <View
          className="flex-1 bg-[#000080] items-center  z-10"
          style={{
            marginTop: -scale(2),
          }}
        >
          <Text className="text-white">Deep Sea</Text>
        </View>
      </ScrollView>
    </View>
  );
}
