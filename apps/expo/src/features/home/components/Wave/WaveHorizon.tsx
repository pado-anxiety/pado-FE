import { Canvas, Skia } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import Animated, {
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
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

interface WaveHorizonProps {
  /** 파도 간격 스케일 - 1.0 = 기본 간격, > 1.0 = 간격 확대, < 1.0 = 간격 축소 */
  gapScale?: SharedValue<number>;
}

export function WaveHorizon({ gapScale }: WaveHorizonProps): React.ReactNode {
  /**
   * 파도 경로 생성
   * @param extraHeight - gapScale로 인해 추가된 캔버스 상단 높이 (파도 그리기 시 보정용)
   */
  const createWavePath = (
    clock: SharedValue<number>,
    multiplier: number,
    width: number,
    amplitude: number,
    frequency: number,
    canvasHeight: number,
    offset: number,
    gapScaleValue: number,
    extraHeight: number,
  ) => {
    'worklet';

    const clockValue = clock.value * multiplier;

    const path = Skia.Path.Make();

    // gapScale을 offset에 적용
    const scaledOffset = offset * gapScaleValue;
    // 캔버스가 위로 확장된 만큼(extraHeight) 파도 위치를 아래로 보정
    const baseY = WAVE_LAYOUT.HORIZON_HEIGHT / 2 + extraHeight;
    const verticalOffset = baseY + scaledOffset;

    path.moveTo(0, verticalOffset);

    for (let x = 0; x <= width + 10; x += 10) {
      const angle = (x / width) * (Math.PI * frequency) + clockValue;
      const y = amplitude * Math.sin(angle) + verticalOffset + 60;
      path.lineTo(x, y);
    }

    path.lineTo(width, canvasHeight);
    path.lineTo(0, canvasHeight);
    path.close();

    return path;
  };

  const { width } = useWindowDimensions();

  const clock = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) return;
    clock.value += frameInfo.timeSincePreviousFrame * 0.002;
  });

  // gapScale에 따른 추가 높이 계산 (캔버스 위로 확장)
  // BACKGROUND.OFFSET이 가장 큰 음수이므로 이를 기준으로 계산
  const getExtraHeight = (scaleValue: number) => {
    'worklet';
    if (scaleValue <= 1.0) return 0;
    // gapScale이 1.0보다 클 때만 추가 높이 필요
    return Math.abs(BACKGROUND.OFFSET) * (scaleValue - 1);
  };

  const backgroundWavePath = useDerivedValue(() => {
    const scaleValue = gapScale?.value ?? 1.0;
    const extraHeight = getExtraHeight(scaleValue);
    const canvasHeight = WAVE_LAYOUT.HORIZON_HEIGHT + extraHeight;
    return createWavePath(
      clock,
      BACKGROUND.SPEED_MULTIPLIER,
      width,
      BACKGROUND.AMPLITUDE,
      BACKGROUND.FREQUENCY,
      canvasHeight,
      BACKGROUND.OFFSET,
      scaleValue,
      extraHeight,
    );
  }, []);

  const foregroundMidWavePath = useDerivedValue(() => {
    const scaleValue = gapScale?.value ?? 1.0;
    const extraHeight = getExtraHeight(scaleValue);
    const canvasHeight = WAVE_LAYOUT.HORIZON_HEIGHT + extraHeight;
    return createWavePath(
      clock,
      FOREGROUND_MID.SPEED_MULTIPLIER,
      width,
      FOREGROUND_MID.AMPLITUDE,
      FOREGROUND_MID.FREQUENCY,
      canvasHeight,
      FOREGROUND_MID.OFFSET,
      scaleValue,
      extraHeight,
    );
  }, []);

  const midgroundWavePath = useDerivedValue(() => {
    const scaleValue = gapScale?.value ?? 1.0;
    const extraHeight = getExtraHeight(scaleValue);
    const canvasHeight = WAVE_LAYOUT.HORIZON_HEIGHT + extraHeight;
    return createWavePath(
      clock,
      MIDGROUND.SPEED_MULTIPLIER,
      width,
      MIDGROUND.AMPLITUDE,
      MIDGROUND.FREQUENCY,
      canvasHeight,
      MIDGROUND.OFFSET,
      scaleValue,
      extraHeight,
    );
  }, []);

  const midgroundBackWavePath = useDerivedValue(() => {
    const scaleValue = gapScale?.value ?? 1.0;
    const extraHeight = getExtraHeight(scaleValue);
    const canvasHeight = WAVE_LAYOUT.HORIZON_HEIGHT + extraHeight;
    return createWavePath(
      clock,
      MIDGROUND_BACK.SPEED_MULTIPLIER,
      width,
      MIDGROUND_BACK.AMPLITUDE,
      MIDGROUND_BACK.FREQUENCY,
      canvasHeight,
      MIDGROUND_BACK.OFFSET,
      scaleValue,
      extraHeight,
    );
  }, []);

  const foregroundWavePath = useDerivedValue(() => {
    const scaleValue = gapScale?.value ?? 1.0;
    const extraHeight = getExtraHeight(scaleValue);
    const canvasHeight = WAVE_LAYOUT.HORIZON_HEIGHT + extraHeight;
    return createWavePath(
      clock,
      FOREGROUND.SPEED_MULTIPLIER,
      width,
      FOREGROUND.AMPLITUDE,
      FOREGROUND.FREQUENCY,
      canvasHeight,
      FOREGROUND.OFFSET,
      scaleValue,
      extraHeight,
    );
  }, []);

  // 캔버스 컨테이너의 동적 스타일 (높이와 marginTop 조절) - gapScale이 있을 때만 사용
  const canvasContainerStyle = useAnimatedStyle(() => {
    // gapScale이 없으면 고정 스타일 반환
    if (!gapScale) {
      return {
        height: WAVE_LAYOUT.HORIZON_HEIGHT,
        marginTop: 0,
      };
    }
    const scaleValue = gapScale.value;
    const extraHeight = getExtraHeight(scaleValue);
    return {
      height: WAVE_LAYOUT.HORIZON_HEIGHT + extraHeight,
      marginTop: -extraHeight, // 캔버스가 위로 확장된 만큼 위로 당김
    };
  }, [gapScale]);

  return (
    <View className="bg-page">
      <Animated.View
        layout={LinearTransition.duration(1000)}
        className="w-full"
      >
        <Animated.View style={[{ width: width }, canvasContainerStyle]}>
          <Canvas
            style={{
              width: '100%',
              height: '100%',
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

        <View
          style={{
            backgroundColor: '#003366',
            paddingBottom: 2000,
            marginBottom: -2000,
            marginTop: -1,
          }}
        />
      </Animated.View>
    </View>
  );
}
