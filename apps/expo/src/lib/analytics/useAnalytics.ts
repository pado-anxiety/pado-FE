import { usePostHog } from 'posthog-react-native';

export const useAnalytics = () => {
  const posthog = usePostHog();

  const trackContent = (title: string) => {
    posthog.capture('pado_content_click', {
      title,
    });
  };

  const trackFunnelIntroExit = (title: string) => {
    posthog.capture('pado_funnel_intro_exit', {
      title,
    });
  };

  // 퍼널구조 다음 버튼 클릭
  //  step 은 현재 스텝을 의미
  //  0 = 0번 스텝 화면
  //  1 = 1번 스텝 화면
  // ...
  const trackFunnelNext = (title: string, step: number) => {
    posthog.capture('pado_funnel_next', {
      title,
      step,
    });
  };

  const trackFunnelPrev = (title: string, step: number) => {
    posthog.capture('pado_funnel_prev', {
      title,
      step,
    });
  };

  // 퍼널구조 이탈
  //  step 은 현재 스텝을 의미
  //  0 = 0번 스텝 화면
  //  1 = 1번 스텝 화면
  // ...
  const trackFunnelExit = (title: string, step: number) => {
    posthog.capture('pado_funnel_exit', {
      title,
      step,
    });
  };

  // 퍼널구조 완료
  //  result 화면에서 완료 버튼 클릭
  const trackFunnelComplete = (title: string) => {
    posthog.capture('pado_funnel_complete', {
      title,
    });
  };

  const identifyUser = (userInfo: { name: string; email: string }) => {
    posthog.identify(userInfo.email, {
      name: userInfo.name,
      email: userInfo.email,
    });
  };

  return {
    trackContent,
    trackFunnelIntroExit,
    trackFunnelNext,
    trackFunnelPrev,
    trackFunnelExit,
    trackFunnelComplete,
    identifyUser,
  };
};
