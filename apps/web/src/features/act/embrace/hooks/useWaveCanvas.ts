import { RefObject, useRef } from 'react';

import { MotionValue, useAnimationFrame } from 'motion/react';

import { CANVAS_CONFIG, GRADIENT_COLORS, WAVE_CONFIGS } from '../constants';

export function useWaveCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  baseYValue: MotionValue<number>,
  amplitude: MotionValue<number>,
  gap: MotionValue<number>,
) {
  const time = useRef(0);
  const dprRef = useRef(1);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext('2d')) return;
    const ctx = canvas.getContext('2d')!;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (
      canvas.width !== width * dpr ||
      canvas.height !== height * dpr ||
      dprRef.current !== dpr
    ) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      dprRef.current = dpr;
    }

    time.current += CANVAS_CONFIG.TIME_INCREMENT;
    const currentAmp = amplitude.get();
    const currentGap = gap.get();
    const currentBaseY = baseYValue.get();

    ctx.clearRect(0, 0, width, height);

    WAVE_CONFIGS.forEach((config, i) => {
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(
        0,
        currentBaseY + i * currentGap - currentAmp,
        0,
        height,
      );
      gradient.addColorStop(0, config.color);
      gradient.addColorStop(1, GRADIENT_COLORS.END);

      ctx.fillStyle = gradient;
      ctx.moveTo(0, height);

      const waveY = currentBaseY + i * currentGap + height * config.offsetRatio;
      for (let x = 0; x <= width; x += CANVAS_CONFIG.WAVE_STEP) {
        const angle =
          (x / width) * (Math.PI * config.frequency) +
          time.current * config.speedMultiplier;
        const y = Math.sin(angle) * currentAmp + waveY;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.fill();
    });
  });
}
