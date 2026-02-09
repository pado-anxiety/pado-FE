import { useCallback, useState } from 'react';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { View } from '@src/components/ui';
import { useFunnel } from '@src/hooks/useFunnel';
import { ANALYTICS_KEY, useAnalytics } from '@src/lib/analytics';
import { useDuration } from '@src/lib/analytics/useDuration';
import { actAPI } from '@src/lib/api/act';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';

import { ActIntroContent, ActResultContent } from '../components';
import { DetachStepContent, ResultDisplay } from './components';
import { DETACH_STEPS } from './constants';
import type {
  DetachContext,
  DetachStepId,
  DetachStepMeta,
  UserTextToken,
} from './types';

export function DetachScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    trackFunnelIntroNext,
    trackFunnelIntroExit,
    trackFunnelNext,
    trackFunnelPrev,
    trackFunnelExit,
    trackFunnelComplete,
  } = useAnalytics();
  const { getDuration, resetDuration } = useDuration();

  const analyticsKey = ANALYTICS_KEY.ACT.DETACH.SEPARATE;

  const [userTextTokens, setUserTextTokens] = useState<UserTextToken[]>([]);

  const handleComplete = useCallback(
    async (context: DetachContext) => {
      try {
        await actAPI.detach({ userTextToken: context.userTextTokens });
      } catch {
        // silent failure
      }
      const duration = getDuration();
      trackFunnelComplete(analyticsKey, duration);
      router.replace(ROUTES.HOME);
    },
    [getDuration, trackFunnelComplete, analyticsKey, router],
  );

  const funnel = useFunnel<DetachStepId, DetachContext>({
    id: 'act-detach',
    steps: DETACH_STEPS,
    initialContext: { userTextTokens: [] },
    onComplete: handleComplete,
  });

  const meta = funnel.step.meta as unknown as DetachStepMeta;

  const handleIntroStart = useCallback(() => {
    triggerHaptic('NAVIGATE');
    const duration = getDuration();
    trackFunnelIntroNext(analyticsKey, duration);
    resetDuration();
    funnel.history.push();
  }, [funnel, getDuration, resetDuration, trackFunnelIntroNext, analyticsKey]);

  const handleNextStep1 = useCallback(
    (text: string) => {
      triggerHaptic('NAVIGATE');
      const duration = getDuration();
      trackFunnelNext(analyticsKey, duration, funnel.currentIndex);
      resetDuration();

      const tokens = text.split(' ').map((word) => ({
        text: word,
        isSelected: false,
      }));
      setUserTextTokens(tokens);
      funnel.history.push();
    },
    [funnel, getDuration, resetDuration, trackFunnelNext, analyticsKey],
  );

  const handleNextStep2 = useCallback(() => {
    triggerHaptic('NAVIGATE');
    const duration = getDuration();
    trackFunnelNext(analyticsKey, duration, funnel.currentIndex);
    resetDuration();

    funnel.history.push(undefined, (prev) => ({
      ...prev,
      userTextTokens,
    }));
  }, [
    funnel,
    getDuration,
    resetDuration,
    trackFunnelNext,
    analyticsKey,
    userTextTokens,
  ]);

  const handleBack = useCallback(() => {
    if (funnel.currentStep === 'intro') {
      const duration = getDuration();
      trackFunnelIntroExit(analyticsKey, duration);
      router.back();
      return;
    }
    if (funnel.currentStep === 'step2') {
      setUserTextTokens([]);
    }
    const duration = getDuration();
    trackFunnelPrev(analyticsKey, duration, funnel.currentIndex);
    resetDuration();
    funnel.history.back();
  }, [
    funnel,
    getDuration,
    resetDuration,
    trackFunnelPrev,
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
        title={t('act.detach.intro.title')}
        description={
          t('act.detach.intro.description', { returnObjects: true }) as string[]
        }
        contentTitle={t('act.detach.intro.contentTitle')}
        contentDescription={t('act.detach.intro.contentDescription')}
        steps={t('act.detach.intro.steps', { returnObjects: true }) as string[]}
        tipText={t('act.detach.intro.tip')}
        buttonText={t('common.button.start')}
        onStart={handleIntroStart}
        onClose={handleClose}
      />
    );
  }

  // Result
  if (meta.type === 'result') {
    return (
      <ActResultContent
        title={t('act.detach.result.title')}
        description={
          t('act.detach.result.description', {
            returnObjects: true,
          }) as string[]
        }
        buttonText={t('common.button.complete')}
        onComplete={handleResultComplete}
      >
        <View className="mt-4">
          <ResultDisplay result={funnel.context.userTextTokens} />
        </View>
      </ActResultContent>
    );
  }

  // Step screens (step1, step2)
  const stepIndex = funnel.currentIndex - 1;

  return (
    <DetachStepContent
      meta={meta}
      stepIndex={stepIndex}
      userTextTokens={userTextTokens}
      onNextStep1={handleNextStep1}
      onNextStep2={handleNextStep2}
      onBack={handleBack}
      onClose={handleClose}
      setUserTextTokens={setUserTextTokens}
    />
  );
}
