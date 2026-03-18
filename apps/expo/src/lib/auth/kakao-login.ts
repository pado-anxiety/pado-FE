import { login } from '@react-native-seoul/kakao-login';
import { getCalendars } from 'expo-localization';

import { authAPI } from '../api/auth';
import { i18n } from '../i18n';
import { AuthResult } from './types';
import { parseAuthToken } from './utils';

export const SignInWithKakao = async (): Promise<AuthResult> => {
  try {
    const token = await login();

    if (!token || !token.idToken || !token.refreshToken) {
      return { errorMessage: i18n.t('auth.error.kakaoFailed') };
    }

    const timezone = getCalendars()[0]?.timeZone ?? 'Asia/Seoul';
    const response = await authAPI.getKaKaoAccessToken({
      identityToken: token.idToken,
      refreshToken: token.refreshToken,
      timezone,
    });

    const { accessToken, refreshToken } = parseAuthToken(response);

    return { accessToken, refreshToken };
  } catch (error: any) {
    const errorStr = String(error);
    const isKakaoCancelError =
      /cancel/i.test(errorStr) ||
      errorStr.includes('취소') ||
      /SdkError.+?2/i.test(errorStr) ||
      error?.code === 'E_CANCELLED_OPERATION';

    if (isKakaoCancelError) {
      return { cancelled: true };
    }
    console.error(error);
    return { errorMessage: i18n.t('auth.error.kakaoError') };
  }
};
