import { useRef } from 'react';

import { MotionValue, useAnimationFrame, useMotionValue } from 'motion/react';

import {
  GRADIENT_END_COLOR,
  WAVE_CONFIG,
  WAVE_CONFIGS,
} from '../constants';

export function useOnboardWave(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isBreathing: boolean,
  gapValue: MotionValue<number>,
) {
  const time = useRef(0);
  const baseYValue = useMotionValue(
    typeof window !== 'undefined'
      ? window.innerHeight * WAVE_CONFIG.BASE_Y_RATIO
      : 0,
  );

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

    time.current += WAVE_CONFIG.TIME_INCREMENT;
    const currentBaseY = baseYValue.get();
    const currentGap = gapValue.get();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    WAVE_CONFIGS.forEach((config, i) => {
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(
        0,
        currentBaseY + i * currentGap - WAVE_CONFIG.AMPLITUDE,
        0,
        canvas.height,
      );
      gradient.addColorStop(0, config.color);
      gradient.addColorStop(1, GRADIENT_END_COLOR);

      ctx.fillStyle = gradient;
      ctx.moveTo(0, canvas.height);

      const waveY =
        currentBaseY + i * currentGap + window.innerHeight * config.offsetRatio;

      for (let x = 0; x <= canvas.width; x += WAVE_CONFIG.WAVE_STEP) {
        const angle =
          (x / canvas.width) * (Math.PI * config.frequency) +
          time.current * config.speedMultiplier;
        const y = Math.sin(angle) * WAVE_CONFIG.AMPLITUDE + waveY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();
    });
  });

  return { baseYValue };
}
