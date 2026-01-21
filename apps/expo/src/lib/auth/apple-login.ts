import * as AppleAuthentication from 'expo-apple-authentication';

import { i18n } from '../i18n';

export const SignInWithApple = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // 1. 프론트가 받는 결과물
    const { identityToken, authorizationCode, fullName, email } = credential;

    console.log('=====Apple Authentication Result=====', {
      identityToken,
      authorizationCode,
      fullName,
      email,
    });

    // 백엔드 요청
  } catch (error) {
    console.error(error);
    return { errorMessage: i18n.t('common.error.generic') };
  }
};
