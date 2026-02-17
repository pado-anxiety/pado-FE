import { useEffect, useRef } from 'react';

import { getCalendars } from 'expo-localization';

import { useAnalytics } from '@src/lib/analytics';
import { userAPI } from '@src/lib/api/user';
import { useAuth } from '@src/lib/auth';

export function useAuthInit() {
  const { isLoggedIn, name, email } = useAuth();
  const { identifyUser } = useAnalytics();

  const isIdentified = useRef(false);
  const isUserPosted = useRef(false);

  useEffect(() => {
    if (isLoggedIn && !isUserPosted.current) {
      isUserPosted.current = true;
      const timezone = getCalendars()[0]?.timeZone ?? 'Asia/Seoul';
      userAPI.postUser(timezone).catch(() => {
        // 토큰 유효성 검사 목적 — 401은 interceptor가 처리하고, 그 외 오류는 무시
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && name && email && !isIdentified.current) {
      isIdentified.current = true;
      identifyUser({ name, email });
    }
  }, [identifyUser, isLoggedIn, name, email]);

  return { isLoggedIn };
}
