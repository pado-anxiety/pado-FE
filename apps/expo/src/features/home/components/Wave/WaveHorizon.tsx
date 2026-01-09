import { Canvas, Skia } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import Animated, {
  LinearTransition,
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

import { View } from '@src/components/ui';

import {
  BACKGROUND,
  FOREGROUND,
  FOREGROUND_MID,
  MIDGROUND,
  MIDGROUND_BACK,
  WAVE_LAYOUT,
} from '../../constants';
import BackgroundWave from './BackgroundWave';
import ForegroundMidWave from './ForegroundMidWave';
import ForegroundWave from './ForegroundWave';
import MidgroundBackWave from './MidgroundBackWave';
import MidgroundWave from './MidgroundWave';

export function WaveHorizon(): React.ReactNode {
  const createWavePath = (
    clock: SharedValue<number>,
    multiplier: number,
    width: number,
    amplitude: number,
    frequency: number,
    horizonHeight: number,
    offset: number,
  ) => {
    'worklet';

    const clockValue = clock.value * multiplier;

    const path = Skia.Path.Make();

    const verticalOffset = horizonHeight / 2 + offset;

    path.moveTo(0, verticalOffset);

    for (let x = 0; x <= width + 10; x += 10) {
      const angle = (x / width) * (Math.PI * frequency) + clockValue;
      const y = amplitude * Math.sin(angle) + verticalOffset + 60;
      path.lineTo(x, y);
    }

    path.lineTo(width, horizonHeight);
    path.lineTo(0, horizonHeight);
    path.close();

    return path;
  };

  const { width } = useWindowDimensions();

  const clock = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) return;
    clock.value += frameInfo.timeSincePreviousFrame * 0.002;
  });

  const backgroundWavePath = useDerivedValue(() => {
    return createWavePath(
      clock,
      BACKGROUND.SPEED_MULTIPLIER,
      width,
      BACKGROUND.AMPLITUDE,
      BACKGROUND.FREQUENCY,
      WAVE_LAYOUT.HORIZON_HEIGHT,
      BACKGROUND.OFFSET,
    );
  }, []);

  const foregroundMidWavePath = useDerivedValue(() => {
    return createWavePath(
      clock,
      FOREGROUND_MID.SPEED_MULTIPLIER,
      width,
      FOREGROUND_MID.AMPLITUDE,
      FOREGROUND_MID.FREQUENCY,
      WAVE_LAYOUT.HORIZON_HEIGHT,
      FOREGROUND_MID.OFFSET,
    );
  }, []);

  const midgroundWavePath = useDerivedValue(() => {
    return createWavePath(
      clock,
      MIDGROUND.SPEED_MULTIPLIER,
      width,
      MIDGROUND.AMPLITUDE,
      MIDGROUND.FREQUENCY,
      WAVE_LAYOUT.HORIZON_HEIGHT,
      MIDGROUND.OFFSET,
    );
  }, []);

  const midgroundBackWavePath = useDerivedValue(() => {
    return createWavePath(
      clock,
      MIDGROUND_BACK.SPEED_MULTIPLIER,
      width,
      MIDGROUND_BACK.AMPLITUDE,
      MIDGROUND_BACK.FREQUENCY,
      WAVE_LAYOUT.HORIZON_HEIGHT,
      MIDGROUND_BACK.OFFSET,
    );
  }, []);

  const foregroundWavePath = useDerivedValue(() => {
    return createWavePath(
      clock,
      FOREGROUND.SPEED_MULTIPLIER,
      width,
      FOREGROUND.AMPLITUDE,
      FOREGROUND.FREQUENCY,
      WAVE_LAYOUT.HORIZON_HEIGHT,
      FOREGROUND.OFFSET,
    );
  }, []);

  return (
    <View className="relative flex-1 bg-[#003366]">
      <View
        className="absolute top-0 w-full bg-page"
        // TODO: 파도 배경 계산 방법 개선
        style={{ height: WAVE_LAYOUT.HORIZON_HEIGHT * 0.6 }}
      />
      <Animated.View layout={LinearTransition.duration(1000)}>
        <Canvas
          style={{
            width: width,
            height: WAVE_LAYOUT.HORIZON_HEIGHT,
            backgroundColor: 'transparent',
          }}
        >
          <BackgroundWave path={backgroundWavePath} />
          <MidgroundBackWave path={midgroundBackWavePath} />
          <MidgroundWave path={midgroundWavePath} />
          <ForegroundMidWave path={foregroundMidWavePath} />
          <ForegroundWave path={foregroundWavePath} />
        </Canvas>
      </Animated.View>
    </View>
  );
}
