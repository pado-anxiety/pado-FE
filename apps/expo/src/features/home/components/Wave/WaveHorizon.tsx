import { Canvas, Fill, LinearGradient, vec } from '@shopify/react-native-skia';
import { useColorScheme } from 'nativewind';
import { useWindowDimensions } from 'react-native';
import Animated, {
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from '@src/components/ui';
import { getOceanColors, getWaveColors } from '@src/lib/theme';

import {
  BACKGROUND,
  FOREGROUND,
  FOREGROUND_MID,
  MIDGROUND,
  MIDGROUND_BACK,
  WAVE_LAYOUT,
} from '../../constants';
import { PageType } from '../../types';
import BackgroundWave from './BackgroundWave';
import ForegroundMidWave from './ForegroundMidWave';
import ForegroundWave from './ForegroundWave';
import MidgroundBackWave from './MidgroundBackWave';
import MidgroundWave from './MidgroundWave';
import { createWavePath, getExtraHeight } from './wave-path-utils';

interface WaveHorizonProps {
  /** 파도 간격 스케일 - 1.0 = 기본 간격, > 1.0 = 간격 확대, < 1.0 = 간격 축소 */
  gapScale?: SharedValue<number>;
  /** 파도 속도 배율 - 기본 0.002, 낮을수록 느림 */
  clockSpeed?: number;
  /** depth gradient 끝점 (px) - 미지정 시 화면 높이의 45% */
  gradientHeight?: number;
  /** 현재 페이지 - CHAT일 때 파도가 노치 위로 올라감 */
  page?: PageType;
}

export function WaveHorizon({
  gapScale,
  clockSpeed = 0.002,
  gradientHeight,
  page,
}: WaveHorizonProps): React.ReactNode {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const waveColors = getWaveColors(scheme);
  const oceanColors = getOceanColors(scheme);

  const { width, height } = useWindowDimensions();

  const clock = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) return;
    clock.value += frameInfo.timeSincePreviousFrame * clockSpeed;
  });

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

  const insets = useSafeAreaInsets();
  const isChatPage = page === 'CHAT';
  const chatOverflow = isChatPage
    ? -(insets.top + WAVE_LAYOUT.HORIZON_HEIGHT)
    : 0;
  // negative marginTop 보상: 첫 번째 채팅 메시지가 상태바 아래에서 시작하도록
  const chatMarginBottom = isChatPage ? insets.top * 2 + 16 : undefined;

  return (
    <View
      className="mb-10"
      style={
        chatMarginBottom !== undefined
          ? { marginBottom: chatMarginBottom }
          : undefined
      }
    >
      <Animated.View
        layout={LinearTransition.duration(800)}
        className="w-full"
        style={{ marginTop: chatOverflow }}
      >
        <Animated.View style={[{ width: width }, canvasContainerStyle]}>
          <Canvas
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
            }}
          >
            <BackgroundWave
              path={backgroundWavePath}
              color={waveColors[0]}
            />
            <MidgroundBackWave
              path={midgroundBackWavePath}
              color={waveColors[1]}
            />
            <MidgroundWave
              path={midgroundWavePath}
              color={waveColors[2]}
            />
            <ForegroundMidWave
              path={foregroundMidWavePath}
              color={waveColors[3]}
            />
            <ForegroundWave
              path={foregroundWavePath}
              color={waveColors[4]}
            />
          </Canvas>
        </Animated.View>

        <View
          style={{
            paddingBottom: 2000,
            marginBottom: -2000,
            marginTop: -2,
          }}
        >
          <Canvas
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <Fill>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, gradientHeight ?? height * 0.45)}
                colors={oceanColors.depthGradient}
              />
            </Fill>
          </Canvas>
        </View>
      </Animated.View>
    </View>
  );
}
