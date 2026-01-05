import { RefObject } from 'react';

import { MotionValue } from 'motion/react';

import { useWaveCanvas } from '../hooks/useWaveCanvas';

type WaveCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  baseYValue: MotionValue<number>;
  amplitude: MotionValue<number>;
  gap: MotionValue<number>;
};

export function WaveCanvas({
  canvasRef,
  baseYValue,
  amplitude,
  gap,
}: WaveCanvasProps) {
  useWaveCanvas(canvasRef, baseYValue, amplitude, gap);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
