import { login } from '@react-native-seoul/kakao-login';

import { authAPI } from '../api/auth';

export const handleKakaoLogin = async () => {
  try {
    const token = await login();
    const response = await authAPI.getKaKaoAccessToken(token.accessToken);

    return response;
  } catch (err) {
    console.error('로그인 중 에러 발생:', err);
  }
};
