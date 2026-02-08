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
import { DiaryStepContent } from './components';
import { DIARY_STEPS } from './constants';
import type { DiaryContext, DiaryStepId, DiaryStepMeta } from './types';

export function DiaryScreen() {
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

  const analyticsKey = ANALYTICS_KEY.ACT.DIARY.EMOTION;

  const handleComplete = useCallback(
    async (context: DiaryContext) => {
      try {
        await actAPI.diary({
          situation: context.answers[0].answer,
          thoughts: context.answers[1].answer,
          feelings: context.answers[2].answer,
        });
      } catch {
        // silent failure
      }
      const duration = getDuration();
      trackFunnelComplete(analyticsKey, duration);
      router.replace(ROUTES.HOME);
    },
    [getDuration, trackFunnelComplete, analyticsKey, router],
  );

  const funnel = useFunnel<DiaryStepId, DiaryContext>({
    id: 'act-diary',
    steps: DIARY_STEPS,
    initialContext: { answers: [] },
    onComplete: handleComplete,
  });

  const meta = funnel.step.meta as unknown as DiaryStepMeta;

  const handleIntroStart = useCallback(() => {
    triggerHaptic('NAVIGATE');
    const duration = getDuration();
    trackFunnelIntroNext(analyticsKey, duration);
    resetDuration();
    funnel.history.push();
  }, [funnel, getDuration, resetDuration, trackFunnelIntroNext, analyticsKey]);

  const handleNext = useCallback(
    (answer: string) => {
      triggerHaptic('NAVIGATE');
      const duration = getDuration();
      trackFunnelNext(analyticsKey, duration, funnel.currentIndex);
      resetDuration();

      const question = t(
        `${(funnel.step.meta as DiaryStepMeta).i18nKey}.question`,
      );
      funnel.history.push(undefined, (prev) => ({
        ...prev,
        answers: [...prev.answers, { question, answer }],
      }));
    },
    [funnel, getDuration, resetDuration, trackFunnelNext, analyticsKey, t],
  );

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
        title={t('act.diary.intro.title')}
        description={
          t('act.diary.intro.description', { returnObjects: true }) as string[]
        }
        contentTitle={t('act.diary.intro.contentTitle')}
        contentDescription={t('act.diary.intro.contentDescription')}
        steps={t('act.diary.intro.steps', { returnObjects: true }) as string[]}
        tipText={t('act.diary.intro.tip')}
        buttonText={t('common.button.start')}
        onStart={handleIntroStart}
        onClose={handleClose}
      />
    );
  }

  if (meta.type === 'result') {
    return (
      <ActResultContent
        title={t('act.diary.result.title')}
        description={
          t('act.diary.result.description', {
            returnObjects: true,
          }) as string[]
        }
        buttonText={t('common.button.complete')}
        onComplete={handleResultComplete}
      >
        <View className="mt-4 gap-3">
          {funnel.context.answers.map((card, index) => (
            <View
              key={`result-${index}`}
              className="rounded-2xl border border-white bg-white/60 p-4"
            >
              <Text
                preset="caption"
                className="text-sub"
              >
                {t(`act.diary.step.step${index + 1}.question`)}
              </Text>
              <Text
                preset="body"
                className="mt-1"
              >
                {card.answer}
              </Text>
            </View>
          ))}
        </View>
      </ActResultContent>
    );
  }

  // Step screens (step1~step3)
  const stepIndex = funnel.currentIndex - 1;

  return (
    <DiaryStepContent
      meta={meta}
      stepIndex={stepIndex}
      historyCards={funnel.context.answers}
      onNext={handleNext}
      onBack={handleBack}
      onClose={handleClose}
    />
  );
}
