import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Linking from 'expo-linking';
import { getCalendars } from 'expo-localization';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { authAPI } from '../api/auth';
import { ENV } from '../env';
import { i18n } from '../i18n';
import {
  generateCodeChallenge,
  generateCodeVerifier,
  getGoogleClientId,
} from './pkce';
import { AuthResult } from './types';
import { parseAuthToken } from './utils';

GoogleSignin.configure({
  webClientId: ENV.WEB_CLIENT_ID,
  iosClientId: ENV.IOS_GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

export const SignInWithGoogle = (): Promise<AuthResult> => {
  if (Platform.OS === 'ios') {
    return SignInWithGoogleOnIOS();
  } else {
    return SignInWithGoogleOnAndroid();
  }
};

const SignInWithGoogleOnIOS = async (): Promise<AuthResult> => {
  try {
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const redirectUri = ENV.IOS_REDIRECT_URI;
    const googleClientId = getGoogleClientId();

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${googleClientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=email%20profile` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type !== 'success' || !result.url) {
      return { cancelled: true };
    }

    const params = Linking.parse(result.url).queryParams;
    const authCode = params?.code;

    if (!authCode || typeof authCode !== 'string') {
      return { errorMessage: i18n.t('auth.error.googleAuthCodeFailed') };
    }

    const timezone = getCalendars()[0]?.timeZone ?? 'Asia/Seoul';
    const response = await authAPI.getGoogleAccessToken({
      codeVerifier,
      authorizationCode: authCode,
      redirectUri,
      platform: 'IOS',
      timezone,
    });

    const { accessToken, refreshToken } = parseAuthToken(response);

    return { accessToken, refreshToken };
  } catch (error) {
    if (isGoogleCancelError(error)) {
      return { cancelled: true };
    }
    console.error(error);
    return { errorMessage: i18n.t('auth.error.googleError') };
  }
};

const isGoogleCancelError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    return (
      code === 'SIGN_IN_CANCELLED' ||
      code === 'ERR_REQUEST_CANCELED' ||
      code === '-5'
    );
  }
  return false;
};

const SignInWithGoogleOnAndroid = async (): Promise<AuthResult> => {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    if (!userInfo?.data || !userInfo.data.serverAuthCode) {
      return { errorMessage: i18n.t('auth.error.googleAuthInfoFailed') };
    }

    const timezone = getCalendars()[0]?.timeZone ?? 'Asia/Seoul';
    const response = await authAPI.getGoogleAccessToken({
      codeVerifier: '',
      authorizationCode: userInfo.data.serverAuthCode,
      redirectUri: '',
      platform: 'ANDROID',
      timezone,
    });

    const { accessToken, refreshToken } = parseAuthToken(response);
    return { accessToken, refreshToken };
  } catch (error) {
    if (isGoogleCancelError(error)) {
      return { cancelled: true };
    }
    console.error(error);
    return { errorMessage: i18n.t('auth.error.googleError') };
  }
};
