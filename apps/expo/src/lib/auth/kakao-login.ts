import { login } from '@react-native-seoul/kakao-login';

import { authAPI } from '../api/auth';
import { i18n } from '../i18n';
import { parseAuthToken } from './utils';

type AuthResult =
  | { accessToken: string; refreshToken: string }
  | { errorMessage: string }
  | { cancelled: true };

export const SignInWithKakao = async (): Promise<AuthResult> => {
  try {
    const token = await login();

    if (!token || !token.idToken || !token.refreshToken) {
      return { errorMessage: i18n.t('auth.error.kakaoFailed') };
    }

    const response = await authAPI.getKaKaoAccessToken({
      identityToken: token.idToken,
      refreshToken: token.refreshToken,
    });

    const { accessToken, refreshToken } = parseAuthToken(response);

    return { accessToken, refreshToken };
  } catch (error: any) {
    const errorStr = String(error);
    if (
      /cancel/i.test(errorStr) ||
      errorStr.includes('취소') ||
      /SdkError.+?2/i.test(errorStr) ||
      error?.code === 'E_CANCELLED_OPERATION'
    ) {
      return { cancelled: true };
    }
    console.error(error);
    return { errorMessage: i18n.t('auth.error.kakaoError') };
  }
};
