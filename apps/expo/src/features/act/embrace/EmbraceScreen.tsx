import { useCallback } from 'react';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Text, View } from '@src/components/ui';
import { useFunnel } from '@src/hooks/useFunnel';
import { ANALYTICS_KEY, useAnalytics } from '@src/lib/analytics';
import { useDuration } from '@src/lib/analytics/useDuration';
import { actAPI } from '@src/lib/api/act';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';

import { ActIntroContent, ActResultContent } from '../components';
import { BreathContent, WaveCanvas } from './components';
import { EMBRACE_STEPS } from './constants';
import { useBreathAnimation } from './hooks/useBreathAnimation';
import type { EmbraceContext, EmbraceStepId, EmbraceStepMeta } from './types';

export function EmbraceScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    trackFunnelIntroNext,
    trackFunnelIntroExit,
    trackFunnelNext,
    trackFunnelExit,
    trackFunnelComplete,
  } = useAnalytics();
  const { getDuration, resetDuration } = useDuration();

  const analyticsKey = ANALYTICS_KEY.ACT.EMBRACE.DEEPEN;

  const breath = useBreathAnimation();

  const handleComplete = useCallback(
    async (context: EmbraceContext) => {
      try {
        await actAPI.embrace({ breathingTime: context.breathingTime });
      } catch {
        // silent failure
      }
      const duration = getDuration();
      trackFunnelComplete(analyticsKey, duration);
      router.replace(ROUTES.HOME);
    },
    [getDuration, trackFunnelComplete, analyticsKey, router],
  );

  const funnel = useFunnel<EmbraceStepId, EmbraceContext>({
    id: 'act-embrace',
    steps: EMBRACE_STEPS,
    initialContext: { breathingTime: 0 },
    onComplete: handleComplete,
  });

  const meta = funnel.step.meta as unknown as EmbraceStepMeta;

  const handleIntroStart = useCallback(() => {
    triggerHaptic('NAVIGATE');
    const duration = getDuration();
    trackFunnelIntroNext(analyticsKey, duration);
    resetDuration();
    funnel.history.push();
  }, [funnel, getDuration, resetDuration, trackFunnelIntroNext, analyticsKey]);

  const handleStepNext = useCallback(() => {
    triggerHaptic('NAVIGATE');
    const duration = getDuration();
    trackFunnelNext(analyticsKey, duration, funnel.currentIndex);
    resetDuration();

    const totalTime = breath.getTotalBreathingTime();
    funnel.history.push(undefined, (prev) => ({
      ...prev,
      breathingTime: totalTime,
    }));
  }, [
    funnel,
    getDuration,
    resetDuration,
    trackFunnelNext,
    analyticsKey,
    breath,
  ]);

  const handleBack = useCallback(() => {
    if (funnel.currentStep === 'intro') {
      const duration = getDuration();
      trackFunnelIntroExit(analyticsKey, duration);
      router.back();
      return;
    }
    triggerHaptic('NAVIGATE');
    resetDuration();
    funnel.history.back();
  }, [
    funnel,
    getDuration,
    resetDuration,
    trackFunnelIntroExit,
    analyticsKey,
    router,
  ]);

  const handleClose = useCallback(() => {
    const duration = getDuration();
    if (funnel.currentStep === 'intro') {
      trackFunnelIntroExit(analyticsKey, duration);
    } else {
      trackFunnelExit(analyticsKey, duration, funnel.currentIndex);
    }
    router.replace(ROUTES.HOME);
  }, [
    funnel,
    getDuration,
    trackFunnelIntroExit,
    trackFunnelExit,
    analyticsKey,
    router,
  ]);

  const handleResultComplete = useCallback(() => {
    funnel.history.push();
  }, [funnel]);

  // Intro
  if (meta.type === 'intro') {
    return (
      <ActIntroContent
        title={t('act.embrace.intro.title')}
        question={t('act.embrace.intro.question')}
        description={
          t('act.embrace.intro.description', {
            returnObjects: true,
          }) as string[]
        }
        contentTitle={t('act.embrace.intro.contentTitle')}
        contentDescription={t('act.embrace.intro.contentDescription')}
        steps={
          t('act.embrace.intro.steps', { returnObjects: true }) as string[]
        }
        tipText={t('act.embrace.intro.tip')}
        buttonText={t('common.button.start')}
        onStart={handleIntroStart}
        onClose={handleClose}
      />
    );
  }

  // Result
  if (meta.type === 'result') {
    const totalTime = funnel.context.breathingTime;

    return (
      <ActResultContent
        title={t('act.embrace.result.title')}
        description={
          t('act.embrace.result.description', {
            returnObjects: true,
          }) as string[]
        }
        buttonText={t('common.button.complete')}
        onComplete={handleResultComplete}
      >
        <View className="mt-4 rounded-2xl border border-white bg-white/60 p-4">
          <Text preset="body">
            {t('act.embrace.result.breathTime', { seconds: totalTime })}
          </Text>
        </View>
      </ActResultContent>
    );
  }

  // Step: Breathing exercise
  return (
    <View className="flex-1 bg-act-page">
      <WaveCanvas
        breathProgress={breath.breathProgress}
        waveBaseY={breath.waveBaseY}
      />
      <BreathContent
        isStarted={breath.isStarted}
        isCompleted={breath.isCompleted}
        breathText={breath.breathText}
        timer={breath.timer}
        onStartClick={breath.handleStartClick}
        onRestart={breath.handleRestart}
        onNext={handleStepNext}
        onBack={handleBack}
        onClose={handleClose}
      />
    </View>
  );
}
