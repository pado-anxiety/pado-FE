import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Linking from 'expo-linking';
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
import { parseAuthToken } from './utils';

type AuthResult =
  | { accessToken: string; refreshToken: string }
  | { errorMessage: string };

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
      return { errorMessage: i18n.t('auth.error.googleAuthCanceled') };
    }

    const params = Linking.parse(result.url).queryParams;
    const authCode = params?.code;

    if (!authCode || typeof authCode !== 'string') {
      return { errorMessage: i18n.t('auth.error.googleAuthCodeFailed') };
    }

    const response = await authAPI.getGoogleAccessToken({
      codeVerifier,
      authorizationCode: authCode,
      redirectUri,
      platform: 'IOS',
    });

    const { accessToken, refreshToken } = parseAuthToken(response);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    return { errorMessage: i18n.t('auth.error.googleError') };
  }
};

const SignInWithGoogleOnAndroid = async (): Promise<AuthResult> => {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    if (!userInfo?.data || !userInfo.data.serverAuthCode) {
      return { errorMessage: i18n.t('auth.error.googleAuthInfoFailed') };
    }

    const response = await authAPI.getGoogleAccessToken({
      codeVerifier: '',
      authorizationCode: userInfo.data.serverAuthCode,
      redirectUri: '',
      platform: 'ANDROID',
    });

    const { accessToken, refreshToken } = parseAuthToken(response);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    return { errorMessage: i18n.t('auth.error.googleError') };
  }
};
