import { useCallback, useMemo, useState } from 'react';

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
import { ActionStepContent } from './components';
import { ACTION_STEPS } from './constants';
import type {
  ActionContext,
  ActionStepId,
  ActionStepMeta,
  Value,
} from './types';

const INITIAL_VALUE: Value = {
  work: null,
  growth: null,
  leisure: null,
  relationship: null,
};

export function ActionScreen() {
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

  const analyticsKey = ANALYTICS_KEY.ACT.ACTION.VALUES;

  // Local state for step data
  const [selectedValue, setSelectedValue] = useState<Value>(INITIAL_VALUE);
  const [selectedDomain, setSelectedDomain] = useState<keyof Value>('work');
  const [orientation, setOrientation] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [action, setAction] = useState('');

  const lowestDomains = useMemo((): (keyof Value)[] => {
    const entries = Object.entries(selectedValue) as [
      keyof Value,
      number | null,
    ][];
    const validEntries = entries.filter(
      (entry): entry is [keyof Value, number] => entry[1] !== null,
    );
    if (validEntries.length === 0) return [];
    const minScore = Math.min(...validEntries.map(([, value]) => value));
    return validEntries
      .filter(([, value]) => value === minScore)
      .map(([key]) => key);
  }, [selectedValue]);

  const handleComplete = useCallback(async () => {
    try {
      const diagnosis = {
        work: selectedValue.work ?? 0,
        growth: selectedValue.growth ?? 0,
        leisure: selectedValue.leisure ?? 0,
        relationship: selectedValue.relationship ?? 0,
      };
      await actAPI.values({
        diagnosis,
        matter: selectedDomain.toUpperCase(),
        value: orientation,
        barrier: obstacle,
        action,
      });
    } catch {
      // silent failure
    }
    const duration = getDuration();
    trackFunnelComplete(analyticsKey, duration);
    router.replace(ROUTES.HOME);
  }, [
    selectedValue,
    selectedDomain,
    orientation,
    obstacle,
    action,
    getDuration,
    trackFunnelComplete,
    analyticsKey,
    router,
  ]);

  const funnel = useFunnel<ActionStepId, ActionContext>({
    id: 'act-action',
    steps: ACTION_STEPS,
    initialContext: {
      selectedValue: INITIAL_VALUE,
      selectedDomain: 'work',
      orientation: '',
      obstacle: '',
      action: '',
    },
    onComplete: handleComplete,
  });

  const meta = funnel.step.meta as unknown as ActionStepMeta;

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

    // After step1 (value check), auto-select lowest domain
    if (funnel.currentStep === 'step1' && lowestDomains.length > 0) {
      setSelectedDomain(lowestDomains[0]);
    }

    funnel.history.push();
  }, [
    funnel,
    getDuration,
    resetDuration,
    trackFunnelNext,
    analyticsKey,
    lowestDomains,
  ]);

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

  const handleSelectValue = useCallback((key: keyof Value, value: number) => {
    setSelectedValue((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSelectDomain = useCallback((domain: keyof Value) => {
    setSelectedDomain(domain);
  }, []);

  // Intro
  if (meta.type === 'intro') {
    return (
      <ActIntroContent
        title={t('act.values.intro.title')}
        description={
          t('act.values.intro.description', { returnObjects: true }) as string[]
        }
        contentTitle={t('act.values.intro.contentTitle')}
        contentDescription={t('act.values.intro.contentDescription')}
        steps={t('act.values.intro.steps', { returnObjects: true }) as string[]}
        tipText={t('act.values.intro.tip')}
        buttonText={t('common.button.start')}
        onStart={handleIntroStart}
        onClose={handleClose}
      />
    );
  }

  // Result
  if (meta.type === 'result') {
    const domainLabel = t(`act.values.domain.${selectedDomain}`);

    return (
      <ActResultContent
        title={t('act.values.result.title')}
        description={
          t('act.values.result.description', {
            returnObjects: true,
          }) as string[]
        }
        buttonText={t('common.button.complete')}
        onComplete={handleResultComplete}
      >
        <View className="mt-4 gap-3">
          <ResultCard
            label={t('act.values.result.selectedDomain')}
            value={domainLabel}
          />
          <ResultCard
            label={t('act.values.result.orientation')}
            value={orientation}
          />
          <ResultCard
            label={t('act.values.result.obstacle')}
            value={obstacle}
          />
          <ResultCard
            label={t('act.values.result.action')}
            value={action}
          />
        </View>
      </ActResultContent>
    );
  }

  // Step screens (step1~step4)
  const stepIndex = funnel.currentIndex - 1;

  return (
    <ActionStepContent
      meta={meta}
      stepIndex={stepIndex}
      selectedValue={selectedValue}
      selectedDomain={selectedDomain}
      lowestDomains={lowestDomains}
      orientation={orientation}
      obstacle={obstacle}
      action={action}
      onSelectValue={handleSelectValue}
      onSelectDomain={handleSelectDomain}
      onOrientationChange={setOrientation}
      onObstacleChange={setObstacle}
      onActionChange={setAction}
      onNext={handleNext}
      onBack={handleBack}
      onClose={handleClose}
    />
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="rounded-2xl border border-white bg-white/60 p-4">
      <Text
        preset="caption"
        className="text-sub"
      >
        {label}
      </Text>
      <Text
        preset="body"
        className="mt-1"
      >
        {value}
      </Text>
    </View>
  );
}
