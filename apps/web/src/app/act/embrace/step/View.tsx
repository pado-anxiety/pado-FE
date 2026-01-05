'use client';

import { useRef } from 'react';

import {
  BreathContent,
  EmbraceStepHeader,
  WaveCanvas,
} from '@/features/act/embrace/components';
import { useBreathAnimation } from '@/features/act/embrace/hooks';

export default function EmbraceStepView() {
  const topInsets = window.topInsets;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    isStarted,
    isCompleted,
    breathText,
    timer,
    sessionCount,
    baseYValue,
    amplitude,
    gap,
    handleStartClick,
    handleRestart,
  } = useBreathAnimation();

  return (
    <div
      className="relative flex flex-col w-full h-screen overflow-hidden bg-act-page/50"
      style={{ paddingTop: `${topInsets || 0}px` }}
    >
      <EmbraceStepHeader />

      <BreathContent
        isStarted={isStarted}
        isCompleted={isCompleted}
        breathText={breathText}
        timer={timer}
        sessionCount={sessionCount}
        onStartClick={handleStartClick}
        onRestart={handleRestart}
      />

      <WaveCanvas
        canvasRef={canvasRef}
        baseYValue={baseYValue}
        amplitude={amplitude}
        gap={gap}
      />
    </div>
  );
}
