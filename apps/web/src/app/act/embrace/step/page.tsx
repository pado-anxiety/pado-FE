'use client';

import { useRef, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';
import { ArrowLeft, X } from 'lucide-react';
import {
  animate,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from 'motion/react';

import { handlePostMessage } from '@/lib';

const BaseYValue = 700;

export default function EmbraceStepPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [breathText, setBreathText] = useState('');
  const [timer, setTimer] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  // 1. 애니메이션 값 관리
  const breathProgress = useMotionValue(0); // 0(날숨) ~ 1(들숨) 사이의 호흡 상태
  const baseYValue = useMotionValue(BaseYValue); // 파도의 기준 수평선 (800은 화면 하단 밖)
  const time = useRef(0);

  // 2. 호흡 상태에 따른 시각 효과 (Reanimated의 interpolate 역할)
  const amplitude = useTransform(breathProgress, [0, 1], [20, 30]);
  const gap = useTransform(breathProgress, [0, 1], [5, 30]);

  const runTimer = async (seconds: number, text: string) => {
    setBreathText(text);
    setTimer(seconds);
    for (let i = seconds; i > 0; i--) {
      setTimer(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleStartClick = async () => {
    setIsStarted(true);

    // 초기 설정: 화면 하단 70% 지점에서 시작
    const startY = BaseYValue;
    baseYValue.set(startY);

    // 4회 반복 시 화면 끝(0 이하)까지 가기 위한 계산
    // 1회 반복당 순수하게 올라갈 높이 = 시작점 / 4
    const risePerCycle = startY / 4;
    const inhaleRise = risePerCycle * 1.7; // 들숨 때 더 많이 올라감 (약간 감소)
    const exhaleDrop = risePerCycle * 1; // 날숨 때 조금 내려감 (차이만큼 누적 상승)

    for (let i = 0; i < 4; i++) {
      const currentY = baseYValue.get();

      // [1] 들숨 (4초): 수평선 대폭 상승 + 파도 커짐
      const inhaleAnim = Promise.all([
        animate(baseYValue, currentY - inhaleRise, {
          duration: 4,
          ease: 'easeInOut',
        }),
        animate(breathProgress, 1, { duration: 4, ease: 'easeInOut' }),
        runTimer(4, '숨을 깊게 들이마셔요'),
      ]);
      await inhaleAnim;

      // [2] 유지 (7초): 수평선 고정 + 파도 최대치 유지
      await runTimer(7, '숨을 멈춘 채 잠시 기다려요');

      // [3] 날숨 (8초): 수평선 아주 살짝 하강 + 파도 작아짐
      const exhaleAnim = Promise.all([
        animate(baseYValue, currentY - inhaleRise + exhaleDrop, {
          duration: 8,
          ease: 'easeInOut',
        }),
        animate(breathProgress, 0, { duration: 8, ease: 'easeInOut' }),
        runTimer(8, '천천히 숨을 내쉬어요'),
      ]);
      await exhaleAnim;
    }

    setTimer(0);
    await animate(baseYValue, -100, { duration: 4, ease: 'easeInOut' }); // 마지막에 완전히 덮기
    setBreathText('불안을 품을 만큼\n바다가 충분히 넓어졌어요');
    setSessionCount((prev) => prev + 1);
    setIsCompleted(true);
  };

  const handleRestart = async () => {
    setIsCompleted(false);
    setBreathText('다시 한 번 숨을 가다듬어 볼까요?');
    setTimer(0);
    breathProgress.set(0);
    await animate(baseYValue, BaseYValue, {
      duration: 3,
      ease: 'easeInOut',
    });
    handleStartClick();
  };

  const calculateTotalTime = () => {
    // 한 주기: (4 + 7 + 8)초 = 19초
    // 한 호흡법: 19초 x 4회 반복 = 76초
    const secondsPerSession = (4 + 7 + 8) * 4; // 76초
    const totalSeconds = secondsPerSession * sessionCount;
    return totalSeconds;
  };

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

    time.current += 0.015;
    const currentAmp = amplitude.get();
    const currentGap = gap.get();
    const currentBaseY = baseYValue.get();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const waveConfigs = [
      {
        color: '#D3F3FF', // Background
        frequency: 2,
        speedMultiplier: 0.7,
        offset: -115,
      },
      {
        color: '#77AADD', // MidgroundBack
        frequency: 2,
        speedMultiplier: 0.3,
        offset: -95,
      },
      {
        color: '#3388CC', // Midground
        frequency: 2,
        speedMultiplier: 0.8,
        offset: -70,
      },
      {
        color: '#005599', // ForegroundMid
        frequency: 2,
        speedMultiplier: 0.5,
        offset: -40,
      },
      {
        color: '#003366', // Foreground
        frequency: 2,
        speedMultiplier: 1,
        offset: 0,
      },
    ];

    waveConfigs.forEach((config, i) => {
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(
        0,
        currentBaseY + i * currentGap - currentAmp,
        0,
        canvas.height,
      );
      gradient.addColorStop(0, config.color);
      gradient.addColorStop(1, '#000814');

      ctx.fillStyle = gradient;
      ctx.moveTo(0, canvas.height);

      const waveY = currentBaseY + i * currentGap + config.offset;
      for (let x = 0; x <= canvas.width; x += 4) {
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

  const handleGoBack = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, { action: 'BACK' });
  const handleGoHome = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, { action: 'HOME' });
  const handleGoResult = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
      data: { embraceResult: calculateTotalTime() },
    });

  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden bg-act-page/50">
      <div className="z-20 flex flex-row w-full justify-between px-8 pt-4">
        <Button
          size="sm"
          color="link"
          onClick={handleGoBack}
        >
          <ArrowLeft
            size={30}
            color="black"
          />
        </Button>
        <Button
          size="sm"
          color="link"
          onClick={handleGoHome}
        >
          <X
            size={30}
            color="black"
          />
        </Button>
      </div>

      <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] flex flex-col items-center justify-center w-full px-4">
        {!isStarted ? (
          <Button
            text="호흡 시작하기"
            size="default"
            fullWidth={false}
            className="bg-btn-act-page text-xl px-20 py-5 rounded-2xl shadow-lg"
            onClick={handleStartClick}
          />
        ) : (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="bg-white/30 backdrop-blur-md rounded-2xl px-6 py-4">
              <Text className="text-title-large text-gray-900 whitespace-pre-wrap leading-tight">
                {breathText}
              </Text>
            </div>
            {timer > 0 && (
              <div className="bg-white/30 backdrop-blur-md rounded-2xl px-6 py-4">
                <Text className="text-[100px] font-bold text-blue-900 leading-none tabular-nums">
                  {timer}
                </Text>
              </div>
            )}
            {isCompleted && (
              <div className="flex flex-col items-center gap-4 mt-4">
                <Button
                  text="다시 호흡하기"
                  size="default"
                  color="primary"
                  fullWidth={false}
                  className="px-20 py-5 rounded-2xl shadow-lg bg-transparent"
                  onClick={handleRestart}
                >
                  <Text className="text-body-small font-bold text-white underline">
                    다시 호흡하기
                  </Text>
                </Button>
                <Button
                  text="호흡 완료"
                  size="default"
                  fullWidth={false}
                  className="bg-btn-act-page text-xl px-20 py-5 rounded-2xl shadow-lg"
                  onClick={handleGoResult}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
}
