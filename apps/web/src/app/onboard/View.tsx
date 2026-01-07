'use client';

import { useEffect, useRef, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button } from '@pado/ui';
import {
  AnimatePresence,
  MotionValue,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
} from 'motion/react';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib/webview';

// -------------------- 타입 및 상수 정의 --------------------

type Step = {
  texts: string[];
  buttonText: string;
};

const steps: Step[] = [
  // ... (기존 steps 배열과 동일)
  {
    texts: ["안녕하세요. 마음의 물결을 마주하는 곳, '파도'입니다."],
    buttonText: '반가워요!',
  },
  {
    texts: ['일상 속 불안 때문에', ' 숨이 가쁘거나 마음이 무거우신가요?'],
    buttonText: '네',
  },
  {
    texts: ['불안에 갇혀', ' 지금 이 순간을 놓치고 있지는 않나요?'],
    buttonText: '네',
  },
  {
    texts: [
      '수용전념치료(ACT)는 말합니다.',
      '불안은 극복의 대상이 아니라,',
      '그저 흘려보내는 것이라고요.',
    ],
    buttonText: '어떻게 흘려보낼 수 있나요?',
  },
  {
    texts: [
      "그래서 '파도'는 우리 마음속 불안을 잠시 머물다 가는 '파도'에 비유했습니다.",
      '그리고 그 파도가 바다의 일부인 것처럼,',
      '우리의 마음 또한 그 파도를 품고 있는 깊고 넓은 바다입니다.',
    ],
    buttonText: '이해했어요',
  },
  {
    texts: ["이제 '파도'와 함께 마음의 바다를 더 넓게 넓혀봐요"],
    buttonText: '좋아요',
  },
  {
    texts: [
      '간단하게 4-7-8 호흡법만 연습해볼게요.',
      '4초 동안 숨을 깊게 들이고,',
      '7초 동안 숨을 멈추고,',
      '8초 동안 숨을 천천히 내쉬어요.',
      '시작하기에 앞서 마음을 진정하는데 도움이 될 거에요.',
    ],
    buttonText: '시작해봐요!',
  },
  {
    texts: [
      '잘하셨어요. 마음이 한결 편안해지셨나요?',
      "이제 '파도'와 함께 마음의 바다를 더 넓혀봐요'",
    ],
    buttonText: '시작하기',
  },
];

const FADE_IN_DURATION = 0.6;
const FADE_OUT_DURATION = 0.4;
const TEXT_DELAY = 0.6;
const BUTTON_DELAY = 0.8;

const BREATH_CYCLE_COUNT = 2;
const BREATH_TIMING = {
  INHALE: 4,
  HOLD: 7,
  EXHALE: 8,
} as const;

const BREATH_TEXTS = {
  INHALE: '숨을 깊게 들이마셔요',
  HOLD: '숨을 멈춘 채 잠시 기다려요',
  EXHALE: '천천히 숨을 내쉬어요',
} as const;

// 파도 설정
const WAVE_CONFIG = {
  AMPLITUDE: 25,
  GAP_NORMAL: 35, // [변경] 기존 GAP -> GAP_NORMAL로 명칭 변경
  GAP_COMPRESSED: 20, // [추가] 들숨 때 좁아질 간격
  BASE_Y_RATIO: 0.2,
  TIME_INCREMENT: 0.015,
  WAVE_STEP: 4,
} as const;

const WAVE_CONFIGS = [
  {
    color: '#D3F3FF',
    frequency: 1.5,
    speedMultiplier: 1.2,
    offsetRatio: -0.18,
  },
  { color: '#77AADD', frequency: 1.5, speedMultiplier: 1, offsetRatio: -0.15 },
  {
    color: '#3388CC',
    frequency: 1.5,
    speedMultiplier: 0.8,
    offsetRatio: -0.13,
  },
  { color: '#005599', frequency: 1.5, speedMultiplier: 1, offsetRatio: -0.09 },
  {
    color: '#003366',
    frequency: 1.5,
    speedMultiplier: 1.2,
    offsetRatio: -0.05,
  },
] as const;

const GRADIENT_END_COLOR = '#000814';

// -------------------- 파도 훅 --------------------
function useOnboardWave(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isBreathing: boolean,
  gapValue: MotionValue<number>, // [변경] gapValue를 인자로 받음
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
    const currentGap = gapValue.get(); // [추가] 현재 gap 값 가져오기

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    WAVE_CONFIGS.forEach((config, i) => {
      ctx.beginPath();
      // [변경] WAVE_CONFIG.GAP 대신 currentGap 사용
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

      // [변경] WAVE_CONFIG.GAP 대신 currentGap 사용
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

// -------------------- 메인 컴포넌트 --------------------
export default function OnboardView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [visibleTexts, setVisibleTexts] = useState<number[]>([]);

  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('');
  const [breathTimer, setBreathTimer] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const insets = window.insets;

  const step = steps[currentStep];

  const BREATHING_STEP_INDEX = 6;
  const isLastStep = currentStep === steps.length - 1;

  // [추가] Gap을 제어할 MotionValue 생성 (초기값: 일반 간격)
  const gapValue = useMotionValue<number>(WAVE_CONFIG.GAP_NORMAL);

  // [변경] 훅에 gapValue 전달
  const { baseYValue } = useOnboardWave(canvasRef, isBreathing, gapValue);
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (isExiting || isBreathing) return;

    const timeouts: number[] = [];

    step.texts.forEach((_, index) => {
      timeouts.push(
        window.setTimeout(
          () => {
            setVisibleTexts((prev) => [...prev, index]);
          },
          index * TEXT_DELAY * 1000,
        ),
      );
    });

    const totalDelay = step.texts.length * BUTTON_DELAY * 1000;
    timeouts.push(
      window.setTimeout(() => {
        setShowButton(true);
      }, totalDelay),
    );

    return () => {
      timeouts.forEach(clearTimeout);
      setVisibleTexts([]);
      setShowButton(false);
    };
  }, [currentStep, isExiting, step.texts, isBreathing]);

  // 호흡법 사이클 로직
  const runBreathCycle = async () => {
    // 1. 들숨 (4초) - 파도 올라감 & 간격 좁아짐
    setBreathText(BREATH_TEXTS.INHALE);
    const inhaleTargetY = window.innerHeight * 0.4;

    // [추가] 높이와 간격을 동시에 애니메이션
    animate(baseYValue, inhaleTargetY, {
      duration: BREATH_TIMING.INHALE,
      ease: 'easeInOut',
    });
    animate(gapValue, WAVE_CONFIG.GAP_COMPRESSED, {
      duration: BREATH_TIMING.INHALE,
      ease: 'easeInOut',
    });

    for (let i = BREATH_TIMING.INHALE; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }

    // 2. 유지 (7초) - 상태 유지
    setBreathText(BREATH_TEXTS.HOLD);
    for (let i = BREATH_TIMING.HOLD; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }

    // 3. 날숨 (8초) - 파도 내려감 & 간격 원래대로 넓어짐
    setBreathText(BREATH_TEXTS.EXHALE);
    const exhaleTargetY = window.innerHeight * 0.7;

    // [추가] 높이와 간격을 동시에 애니메이션
    animate(baseYValue, exhaleTargetY, {
      duration: BREATH_TIMING.EXHALE,
      ease: 'easeInOut',
    });
    animate(gapValue, WAVE_CONFIG.GAP_NORMAL, {
      duration: BREATH_TIMING.EXHALE,
      ease: 'easeInOut',
    });

    for (let i = BREATH_TIMING.EXHALE; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }
  };

  const startBreathing = async () => {
    setIsBreathing(true);
    setShowButton(false);

    // 준비 단계: 파도 내리기
    const readyY = window.innerHeight * 0.85;
    animate(baseYValue, readyY, { duration: 1.5, ease: 'easeInOut' });
    await wait(1500);

    // 호흡 사이클 반복
    for (let i = 0; i < BREATH_CYCLE_COUNT; i++) {
      await runBreathCycle();
    }

    // 호흡 종료 후 처리
    setBreathText('호흡을 완료했어요');
    setBreathTimer(0);

    // 파도 높이 및 간격을 원래대로 복귀
    const originalY = window.innerHeight * WAVE_CONFIG.BASE_Y_RATIO;
    animate(baseYValue, originalY, { duration: 1.5, ease: 'easeInOut' });
    // [추가] 간격도 원래대로 확실하게 복귀
    animate(gapValue, WAVE_CONFIG.GAP_NORMAL, {
      duration: 1.5,
      ease: 'easeInOut',
    });

    await wait(1500);

    setIsBreathing(false);
    setCurrentStep((prev) => prev + 1);
  };

  const handleNext = () => {
    setShowButton(false);

    if (currentStep === BREATHING_STEP_INDEX) {
      startBreathing();
      return;
    }

    if (isLastStep) {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
        action: 'LOGIN',
      });
      return;
    }

    setIsExiting(true);

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        setIsExiting(false);
      }
    }, FADE_OUT_DURATION * 1000);
  };

  return (
    // ... (JSX 부분은 기존과 동일)
    <PageLayout className="bg-act-page justify-between relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div
        className="absolute inset-0 z-10 w-full h-full px-8"
        style={{
          paddingTop: `${insets.top}px`,
          paddingBottom: `${insets.bottom + 32}px`,
        }}
      >
        <AnimatePresence mode="wait">
          {!isBreathing ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: isExiting ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: isExiting ? FADE_OUT_DURATION : FADE_IN_DURATION,
              }}
              className="flex flex-col items-center justify-center w-full gap-8 h-full"
            >
              <div className="flex flex-col items-start w-full flex-1 justify-between">
                <div className="flex flex-col flex-1 items-start justify-center gap-2">
                  {step.texts.map((text, index) => {
                    const isVisible = visibleTexts.includes(index);
                    return (
                      <motion.p
                        key={`step-${currentStep}-text-${text.slice(0, 20)}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: isVisible ? 1 : 0,
                          y: isVisible ? 0 : 20,
                        }}
                        transition={{ duration: FADE_IN_DURATION }}
                        className="text-2xl font-medium leading-relaxed text-white"
                      >
                        {text}
                      </motion.p>
                    );
                  })}
                </div>

                <motion.div
                  key={`btn-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: showButton && !isExiting ? 1 : 0,
                    y: showButton && !isExiting ? 0 : 20,
                  }}
                  transition={{ duration: FADE_IN_DURATION }}
                  className="w-full"
                >
                  <Button
                    text={step.buttonText}
                    onClick={handleNext}
                    size="default"
                    className="bg-btn-act-page w-full text-lg font-semibold"
                    disabled={!showButton || isExiting}
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="breathing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center w-full h-full gap-6"
            >
              {breathText && (
                <motion.p
                  key={breathText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl text-white font-medium text-center px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-sm"
                >
                  {breathText}
                </motion.p>
              )}

              {breathTimer > 0 && (
                <motion.div
                  key={breathTimer}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-bold text-white tracking-widest px-8 py-6 rounded-3xl bg-black/40 backdrop-blur-sm"
                >
                  {breathTimer}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
