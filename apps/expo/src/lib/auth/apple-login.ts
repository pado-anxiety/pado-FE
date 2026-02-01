import * as AppleAuthentication from 'expo-apple-authentication';

import { authAPI } from '../api/auth';
import { i18n } from '../i18n';
import { parseAuthToken } from './utils';

type AuthResult =
  | { accessToken: string; refreshToken: string }
  | { errorMessage: string }
  | { cancelled: true };

export const SignInWithApple = async (): Promise<AuthResult> => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { authorizationCode, fullName } = credential;
    console.log(authorizationCode, fullName);

    if (!authorizationCode) {
      return { errorMessage: i18n.t('common.error.generic') };
    }

    let userName: string | null = null;
    if (fullName && (fullName.familyName || fullName.givenName)) {
      userName =
        `${fullName.familyName ?? ''}${fullName.givenName ?? ''}`.trim();
    }

    const response = await authAPI.getAppleAccessToken({
      authorizationCode,
      fullName: userName,
    });

    const { accessToken, refreshToken } = parseAuthToken(response);

    console.log(accessToken, refreshToken);

    return { accessToken, refreshToken };
  } catch (error: any) {
    if (error?.code === 'ERR_REQUEST_CANCELED') {
      return { cancelled: true };
    }
    console.error(error);
    return { errorMessage: i18n.t('common.error.generic') };
  }
};
