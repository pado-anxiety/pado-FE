import * as AppleAuthentication from 'expo-apple-authentication';
import { getCalendars } from 'expo-localization';

import { authAPI } from '../api/auth';
import { i18n } from '../i18n';
import { AuthResult } from './types';
import { parseAuthToken } from './utils';

export const SignInWithApple = async (): Promise<AuthResult> => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { authorizationCode, fullName } = credential;

    if (!authorizationCode) {
      return { errorMessage: i18n.t('common.error.generic') };
    }

    let userName: string | null = null;
    if (fullName?.familyName && fullName?.givenName) {
      userName = `${fullName.familyName} ${fullName.givenName}`.trim();
    }

    const timezone = getCalendars()[0]?.timeZone ?? 'Asia/Seoul';
    const response = await authAPI.getAppleAccessToken({
      authorizationCode,
      fullName: userName,
      timezone,
    });

    const { accessToken, refreshToken } = parseAuthToken(response);

    return { accessToken, refreshToken };
  } catch (error: any) {
    if (error?.code === 'ERR_REQUEST_CANCELED') {
      return { cancelled: true };
    }
    console.error(error);
    return { errorMessage: i18n.t('common.error.generic') };
  }
};
