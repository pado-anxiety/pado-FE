import { login } from '@react-native-seoul/kakao-login';

import { authAPI } from '../api/auth';
import { useAuth } from './auth-context';
import { parseAuthToken } from './utils';

export const SignInWithKakao = async () => {
  try {
    const token = await login();
    console.log('token: ', token);

    if (!token || !token.accessToken) {
      throw new Error('카카오 로그인 실패: 토큰을 받아올 수 없습니다');
    }

    const response = await authAPI.getKaKaoAccessToken(token.accessToken);

    const { accessToken, refreshToken } = parseAuthToken(response);
    useAuth.getState().login(accessToken, refreshToken);
  } catch (err) {
    console.error('로그인 중 에러 발생:', err);
    throw err;
  }
};
