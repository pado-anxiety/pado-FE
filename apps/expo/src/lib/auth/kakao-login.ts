import { login } from '@react-native-seoul/kakao-login';

import { authAPI } from '../api/auth';

export const SignInWithKakao = async () => {
  try {
    const token = await login();

    if (!token || !token.accessToken) {
      throw new Error('카카오 로그인 실패: 토큰을 받아올 수 없습니다');
    }

    const response = await authAPI.getKaKaoAccessToken(token.accessToken);

    return response;
  } catch (err) {
    console.error('로그인 중 에러 발생:', err);
    throw err;
  }
};
