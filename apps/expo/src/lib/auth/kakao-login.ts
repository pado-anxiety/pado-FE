import { login } from '@react-native-seoul/kakao-login';

import { authAPI } from '../api/auth';
import { parseAuthToken } from './utils';

type AuthResult =
  | { accessToken: string; refreshToken: string }
  | { errorMessage: string };

export const SignInWithKakao = async (): Promise<AuthResult> => {
  try {
    const token = await login();
    console.log('token: ', token);

    if (!token || !token.accessToken) {
      return { errorMessage: '카카오 로그인에 실패했습니다.' };
    }

    const response = await authAPI.getKaKaoAccessToken(token.accessToken);

    const { accessToken, refreshToken } = parseAuthToken(response);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    return { errorMessage: '카카오 로그인 중 오류가 발생했습니다.' };
  }
};
