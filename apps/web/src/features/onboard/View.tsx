'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { AnimatePresence } from 'motion/react';
import { useMotionValue } from 'motion/react';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib/webview';

import { BreathContent, StepContent, WaveCanvas } from './components';
import {
  BREATHING_STEP_INDEX,
  BUTTON_DELAY,
  FADE_OUT_DURATION,
  STEP_COUNT,
  TEXT_DELAY,
  WAVE_CONFIG,
} from './constants';
import { useOnboardBreathing, useOnboardWave } from './hooks';
import type { Step } from './types';

export default function OnboardView() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [visibleTexts, setVisibleTexts] = useState<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gapValue = useMotionValue<number>(WAVE_CONFIG.GAP_NORMAL);

  const insets = window.insets;

  // Get step data from i18n
  const getStep = (index: number): Step => {
    const stepKey = `onboard.steps.step${index + 1}`;
    return {
      texts: t(`${stepKey}.texts`, { returnObjects: true }) as string[],
      buttonText: t(`${stepKey}.button`),
    };
  };

  const step = getStep(currentStep);
  const isLastStep = currentStep === STEP_COUNT - 1;

  const { baseYValue } = useOnboardWave(canvasRef, false, gapValue);
  const { isBreathing, breathText, breathTimer, startBreathing } =
    useOnboardBreathing(baseYValue, gapValue);

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

  const handleNext = async () => {
    setShowButton(false);

    if (currentStep === BREATHING_STEP_INDEX) {
      const completed = await startBreathing();
      if (completed) {
        setCurrentStep((prev) => prev + 1);
      }
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
      if (currentStep < STEP_COUNT - 1) {
        setCurrentStep((prev) => prev + 1);
        setIsExiting(false);
      }
    }, FADE_OUT_DURATION * 1000);
  };

  return (
    <PageLayout className="bg-act-page justify-between relative overflow-hidden">
      <WaveCanvas canvasRef={canvasRef} />

      <div
        className="absolute inset-0 z-10 w-full h-full px-8"
        style={{
          paddingTop: `${insets.top}px`,
          paddingBottom: `${insets.bottom + 32}px`,
        }}
      >
        <AnimatePresence mode="wait">
          {!isBreathing ? (
            <StepContent
              step={step}
              visibleTexts={visibleTexts}
              showButton={showButton}
              isExiting={isExiting}
              onNext={handleNext}
            />
          ) : (
            <BreathContent breathText={breathText} breathTimer={breathTimer} />
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
