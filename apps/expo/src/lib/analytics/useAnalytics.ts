import { usePostHog } from 'posthog-react-native';

export const useAnalytics = () => {
  const posthog = usePostHog();

  const trackContent = (title: string) => {
    posthog.capture('pado_content_click', {
      title,
    });
  };

  const trackFunnelIntroNext = (title: string, duration: number) => {
    posthog.capture('pado_funnel_intro_next', {
      title,
      duration,
    });
  };

  const trackFunnelIntroExit = (title: string, duration: number) => {
    posthog.capture('pado_funnel_intro_exit', {
      title,
      duration,
    });
  };

  // 퍼널구조 다음 버튼 클릭
  //  step 은 현재 스텝을 의미
  //  0 = 0번 스텝 화면
  //  1 = 1번 스텝 화면
  // ...
  const trackFunnelNext = (title: string, duration: number, step: number) => {
    posthog.capture('pado_funnel_next', {
      title,
      duration,
      step,
    });
  };

  const trackFunnelPrev = (title: string, duration: number, step: number) => {
    posthog.capture('pado_funnel_prev', {
      title,
      duration,
      step,
    });
  };

  // 퍼널구조 이탈
  //  step 은 현재 스텝을 의미
  //  0 = 0번 스텝 화면
  //  1 = 1번 스텝 화면
  // ...
  const trackFunnelExit = (title: string, duration: number, step: number) => {
    posthog.capture('pado_funnel_exit', {
      title,
      duration,
      step,
    });
  };

  // 퍼널구조 완료
  //  result 화면에서 완료 버튼 클릭
  const trackFunnelComplete = (title: string, duration: number) => {
    posthog.capture('pado_funnel_complete', {
      title,
      duration,
    });
  };

  // 온보딩
  const trackOnboardStart = () => {
    posthog.capture('pado_onboard_start');
  };

  const trackOnboardComplete = (duration: number) => {
    posthog.capture('pado_onboard_complete', { duration });
  };

  const trackOnboardExit = (step: number, duration: number) => {
    posthog.capture('pado_onboard_exit', { step, duration });
  };

  // 로그인
  const trackLoginAttempt = (method: string) => {
    posthog.capture('pado_login_attempt', { method });
  };

  const trackLoginSuccess = (method: string) => {
    posthog.capture('pado_login_success', { method });
  };

  const trackLoginFail = (method: string, error: string) => {
    posthog.capture('pado_login_fail', { method, error });
  };

  // 페이지 뷰
  const trackPageView = (page: string) => {
    posthog.capture('pado_page_view', { page });
  };

  // 채팅
  const trackChatEnter = () => {
    posthog.capture('pado_chat_enter');
  };

  const trackChatExit = (duration: number) => {
    posthog.capture('pado_chat_exit', { duration });
  };

  const trackChatSend = () => {
    posthog.capture('pado_chat_send');
  };

  // 학습
  const trackLearningComplete = (title: string, duration: number) => {
    posthog.capture('pado_learning_complete', { title, duration });
  };

  // 푸시 알림
  const trackPushOpened = (campaign?: string) => {
    posthog.capture('pado_push_opened', {
      ...(campaign && { campaign }),
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
    trackFunnelIntroNext,
    trackFunnelIntroExit,
    trackFunnelNext,
    trackFunnelPrev,
    trackFunnelExit,
    trackFunnelComplete,
    trackOnboardStart,
    trackOnboardComplete,
    trackOnboardExit,
    trackLoginAttempt,
    trackLoginSuccess,
    trackLoginFail,
    trackPageView,
    trackChatEnter,
    trackChatExit,
    trackChatSend,
    trackLearningComplete,
    trackPushOpened,
    identifyUser,
  };
};
