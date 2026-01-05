import { RefObject, useRef } from 'react';

import { MotionValue, useAnimationFrame } from 'motion/react';

import {
  ANIMATION_VALUES,
  CANVAS_CONFIG,
  GRADIENT_COLORS,
  WAVE_CONFIGS,
} from '../constants';

const BaseYValue = window.innerHeight * ANIMATION_VALUES.BASE_Y_RATIO;

export function useWaveCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  baseYValue: MotionValue<number>,
  amplitude: MotionValue<number>,
  gap: MotionValue<number>,
) {
  const time = useRef(0);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext('2d')) return;
    const ctx = canvas.getContext('2d')!;

    if (
      canvas.width !== window.innerWidth ||
      canvas.height !== window.innerHeight
    ) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    time.current += ANIMATION_VALUES.TIME_INCREMENT;
    const currentAmp = amplitude.get();
    const currentGap = gap.get();
    const currentBaseY = baseYValue.get();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    WAVE_CONFIGS.forEach((config, i) => {
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(
        0,
        currentBaseY + i * currentGap - currentAmp,
        0,
        canvas.height,
      );
      gradient.addColorStop(0, config.color);
      gradient.addColorStop(1, GRADIENT_COLORS.END);

      ctx.fillStyle = gradient;
      ctx.moveTo(0, canvas.height);

      const waveY =
        currentBaseY + i * currentGap + BaseYValue * config.offsetRatio;
      for (let x = 0; x <= canvas.width; x += CANVAS_CONFIG.WAVE_STEP) {
        const angle =
          (x / canvas.width) * (Math.PI * config.frequency) +
          time.current * config.speedMultiplier;
        const y = Math.sin(angle) * currentAmp + waveY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();
    });
  });
}
