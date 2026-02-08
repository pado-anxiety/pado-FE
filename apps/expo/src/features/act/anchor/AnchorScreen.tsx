import { useCallback } from 'react';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useFunnel } from '@src/hooks/useFunnel';
import { ANALYTICS_KEY, useAnalytics } from '@src/lib/analytics';
import { useDuration } from '@src/lib/analytics/useDuration';
import { actAPI } from '@src/lib/api/act';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';

import { ActIntroContent, ActResultContent } from '../components';
import { AnchorStepContent } from './components';
import { ANCHOR_STEPS } from './constants';
import type { AnchorContext, AnchorStepId, AnchorStepMeta } from './types';

export function AnchorScreen() {
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

  const analyticsKey = ANALYTICS_KEY.ACT.ANCHOR.FIVE;

  const handleComplete = useCallback(async () => {
    try {
      await actAPI.anchor();
    } catch {
      // silent failure
      // TODO: 실패 시 로컬 저장 후 네트워크가 연결되면 한꺼번에 전송
    }
    const duration = getDuration();
    trackFunnelComplete(analyticsKey, duration);
    router.replace(ROUTES.HOME);
  }, [getDuration, trackFunnelComplete, analyticsKey, router]);

  const funnel = useFunnel<AnchorStepId, AnchorContext>({
    id: 'act-anchor',
    steps: ANCHOR_STEPS,
    initialContext: {},
    onComplete: handleComplete,
  });

  const meta = funnel.step.meta as unknown as AnchorStepMeta;

  const handleIntroStart = useCallback(() => {
    triggerHaptic('NAVIGATE');
    const duration = getDuration();
    trackFunnelIntroNext(analyticsKey, duration);
    resetDuration();
    funnel.history.push();
  }, [funnel, getDuration, resetDuration, trackFunnelIntroNext, analyticsKey]);

  const handleNext = useCallback(() => {
    triggerHaptic('NAVIGATE');
    const duration = getDuration();
    trackFunnelNext(analyticsKey, duration, funnel.currentIndex);
    resetDuration();
    funnel.history.push();
  }, [funnel, getDuration, resetDuration, trackFunnelNext, analyticsKey]);

  const handleBack = useCallback(() => {
    if (funnel.currentStep === 'intro') {
      const duration = getDuration();
      trackFunnelIntroExit(analyticsKey, duration);
      router.back();
      return;
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

  // Render based on current step
  if (meta.type === 'intro') {
    return (
      <ActIntroContent
        title={t('act.anchor.intro.title')}
        description={
          t('act.anchor.intro.description', { returnObjects: true }) as string[]
        }
        contentTitle={t('act.anchor.intro.contentTitle')}
        contentDescription={t('act.anchor.intro.contentDescription')}
        steps={t('act.anchor.intro.steps', { returnObjects: true }) as string[]}
        tipText={t('act.anchor.intro.tip')}
        buttonText={t('common.button.start')}
        onStart={handleIntroStart}
        onClose={handleClose}
      />
    );
  }

  if (meta.type === 'result') {
    return (
      <ActResultContent
        title={t('act.anchor.result.title')}
        description={
          t('act.anchor.result.description', {
            returnObjects: true,
          }) as string[]
        }
        buttonText={t('common.button.complete')}
        onComplete={handleResultComplete}
      />
    );
  }

  // Step screens (step1~step5)
  // stepIndex relative to step screens: currentIndex - 1 (since intro is index 0)
  const stepIndex = funnel.currentIndex - 1;

  return (
    <AnchorStepContent
      meta={meta}
      stepIndex={stepIndex}
      onNext={handleNext}
      onBack={handleBack}
      onClose={handleClose}
    />
  );
}
