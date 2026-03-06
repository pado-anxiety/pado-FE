import {
  Canvas,
  LinearGradient,
  Path,
  Skia,
  type SkPath,
  vec,
} from '@shopify/react-native-skia';
import { useIsFocused } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { AppState, useWindowDimensions } from 'react-native';
import {
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

import { getOceanColors, getWaveColors } from '@src/lib/theme';

import { WAVE_CONFIGS } from '../constants';

interface WaveCanvasProps {
  breathProgress: SharedValue<number>;
  waveBaseY: SharedValue<number>;
}

const WAVE_STEP = 12;
const TIME_INCREMENT = 0.011;
const AMPLITUDE_MIN = 15;
const AMPLITUDE_MAX = 25;
const GAP_MIN = 5;
const GAP_MAX = 30;

export function WaveCanvas({ breathProgress, waveBaseY }: WaveCanvasProps) {
  const { width, height } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const waveColors = getWaveColors(scheme);
  const ocean = getOceanColors(scheme);
  const time = useSharedValue(0);

  const isFocused = useIsFocused();

  const frameCallback = useFrameCallback(() => {
    time.value += TIME_INCREMENT;
  });

  // 화면이 보이지 않거나 앱이 백그라운드일 때 프레임 콜백 중단
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      frameCallback.setActive(state === 'active' && isFocused);
    });
    frameCallback.setActive(isFocused);
    return () => sub.remove();
  }, [frameCallback, isFocused]);

  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: -2,
        width: width + 4,
        height,
      }}
    >
      {WAVE_CONFIGS.map((config, index) => (
        <WaveLayer
          key={index}
          config={config}
          color={waveColors[index]}
          gradientEndColor={ocean.deep}
          index={index}
          width={width + 4}
          height={height}
          time={time}
          breathProgress={breathProgress}
          waveBaseY={waveBaseY}
        />
      ))}
    </Canvas>
  );
}

function WaveLayer({
  config,
  color,
  gradientEndColor,
  index,
  width,
  height,
  time,
  breathProgress,
  waveBaseY,
}: {
  config: (typeof WAVE_CONFIGS)[number];
  color: string;
  gradientEndColor: string;
  index: number;
  width: number;
  height: number;
  time: SharedValue<number>;
  breathProgress: SharedValue<number>;
  waveBaseY: SharedValue<number>;
}) {
  // 이전 프레임의 Path를 보관 → 다음 프레임에서 dispose하여 네이티브 메모리 즉시 해제
  const prevPath = useSharedValue<SkPath | null>(null);

  const path = useDerivedValue(() => {
    if (prevPath.value) {
      prevPath.value.dispose();
    }

    const p = Skia.Path.Make();
    const progress = breathProgress.value;
    const baseAmplitude =
      AMPLITUDE_MIN + progress * (AMPLITUDE_MAX - AMPLITUDE_MIN);
    const amplitude = baseAmplitude * config.amplitudeScale;
    const gap = GAP_MIN + progress * (GAP_MAX - GAP_MIN);
    const baseY = waveBaseY.value * height;
    const waveY = baseY + index * gap + height * config.offsetRatio;

    p.moveTo(0, height);

    for (let x = 0; x <= width + WAVE_STEP; x += WAVE_STEP) {
      const angle =
        (x / width) * (Math.PI * config.frequency) +
        time.value * config.speedMultiplier;
      const y = Math.sin(angle) * amplitude + waveY;
      p.lineTo(x, y);
    }

    p.lineTo(width, height);
    p.close();

    prevPath.value = p;
    return p;
  }, [time, breathProgress, waveBaseY]);

  const gradientStart = useDerivedValue(() => {
    const progress = breathProgress.value;
    const baseAmplitude =
      AMPLITUDE_MIN + progress * (AMPLITUDE_MAX - AMPLITUDE_MIN);
    const amplitude = baseAmplitude * config.amplitudeScale;
    const gap = GAP_MIN + progress * (GAP_MAX - GAP_MIN);
    const baseY = waveBaseY.value * height;
    return vec(0, baseY + index * gap - amplitude);
  }, [breathProgress, waveBaseY]);

  return (
    <Path path={path}>
      <LinearGradient
        start={gradientStart}
        end={vec(0, height)}
        colors={[color, gradientEndColor]}
      />
    </Path>
  );
}
