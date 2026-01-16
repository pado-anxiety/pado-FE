import { login } from '@react-native-seoul/kakao-login';

import { authAPI } from '../api/auth';
import { i18n } from '../i18n';
import { parseAuthToken } from './utils';

type AuthResult =
  | { accessToken: string; refreshToken: string }
  | { errorMessage: string };

export const SignInWithKakao = async (): Promise<AuthResult> => {
  try {
    const token = await login();

    if (!token || !token.accessToken) {
      return { errorMessage: i18n.t('auth.error.kakaoFailed') };
    }

    const response = await authAPI.getKaKaoAccessToken(token.accessToken);

    const { accessToken, refreshToken } = parseAuthToken(response);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    return { errorMessage: i18n.t('auth.error.kakaoError') };
  }
};
