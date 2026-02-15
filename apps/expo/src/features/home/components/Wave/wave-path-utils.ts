import { Skia } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';

import { BACKGROUND, WAVE_LAYOUT } from '../../constants';

/**
 * 파도 경로 생성
 * @param extraHeight - gapScale로 인해 추가된 캔버스 상단 높이 (파도 그리기 시 보정용)
 */
export function createWavePath(
  clock: SharedValue<number>,
  multiplier: number,
  width: number,
  amplitude: number,
  frequency: number,
  canvasHeight: number,
  offset: number,
  gapScaleValue: number,
  extraHeight: number,
) {
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
}

// gapScale에 따른 추가 높이 계산 (캔버스 위로 확장)
// BACKGROUND.OFFSET이 가장 큰 음수이므로 이를 기준으로 계산
export function getExtraHeight(scaleValue: number) {
  'worklet';
  if (scaleValue <= 1.0) return 0;
  // gapScale이 1.0보다 클 때만 추가 높이 필요
  return Math.abs(BACKGROUND.OFFSET) * (scaleValue - 1);
}
