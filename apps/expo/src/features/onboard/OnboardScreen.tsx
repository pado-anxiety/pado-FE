import { useCallback, useEffect } from 'react';

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { View } from '@src/components/ui';
import { WaveHorizon } from '@src/features/home';
import { useFunnel } from '@src/hooks/useFunnel';
import { setIsOnboarded } from '@src/lib';
import { ANALYTICS_KEY, useAnalytics } from '@src/lib/analytics';
import { useDuration } from '@src/lib/analytics/useDuration';
import { ROUTES } from '@src/lib/route';

import { StepContent } from './components';
import { ONBOARD_STEPS } from './constants';
import { OnboardContext, OnboardStepId, OnboardStepMeta } from './types';

/**
 * 온보딩 화면
 * useFunnel 훅을 사용한 선언적 퍼널 구조
 */
export function OnboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    trackFunnelNext,
    trackOnboardStart,
    trackOnboardComplete,
    trackOnboardExit,
  } = useAnalytics();
  const { getDuration, resetDuration } = useDuration();

  // 온보딩 시작 추적
  useEffect(() => {
    trackOnboardStart();
  }, [trackOnboardStart]);

  // 퍼널 완료 시 로그인 화면으로 이동
  const handleComplete = useCallback(() => {
    const duration = getDuration();
    trackOnboardComplete(duration);
    setIsOnboarded(true);
    router.replace(ROUTES.LOGIN);
  }, [router, getDuration, trackOnboardComplete]);

  // 퍼널 초기화
  const funnel = useFunnel<OnboardStepId, OnboardContext>({
    id: 'onboard',
    steps: ONBOARD_STEPS,
    initialContext: {},
    onComplete: handleComplete,
  });

  // 현재 스텝의 메타데이터
  const meta = funnel.step.meta as unknown as OnboardStepMeta;

  // i18n에서 텍스트 가져오기
  const texts = t(`${meta.i18nKey}.texts`, { returnObjects: true }) as string[];
  const buttonText = t(`${meta.i18nKey}.button`);

  // 다음 스텝으로 이동
  const handleNext = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const duration = getDuration();
    const currentIndex = funnel.currentIndex;

    trackFunnelNext(ANALYTICS_KEY.ONBOARD, duration, currentIndex);
    resetDuration();

    await funnel.history.push();
  }, [funnel, getDuration, resetDuration, trackFunnelNext]);

  return (
    <View
      className="flex-1 bg-page"
      style={{ paddingTop: insets.top }}
    >
      <WaveHorizon clockSpeed={0.0012} />

      <View
        className="flex-1 justify-between bg-transparent py-8"
        style={{
          paddingBottom: insets.bottom + scale(20),
        }}
      >
        <StepContent
          texts={texts}
          buttonText={buttonText}
          onNext={handleNext}
          stepKey={funnel.currentStep}
        />
      </View>
    </View>
  );
}
