import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { authAPI } from '../api/auth';
import { ENV } from '../env';
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
      return { errorMessage: 'Google 로그인 인증이 취소되었습니다.' };
    }

    const params = Linking.parse(result.url).queryParams;
    const authCode = params?.code;

    if (!authCode || typeof authCode !== 'string') {
      return { errorMessage: 'Google 로그인 인증 코드를 받아올 수 없습니다.' };
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
    return { errorMessage: 'Google 로그인 중 오류가 발생했습니다.' };
  }
};

const SignInWithGoogleOnAndroid = async (): Promise<AuthResult> => {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    if (!userInfo?.data || !userInfo.data.serverAuthCode) {
      return { errorMessage: 'Google 로그인 인증 정보를 받아올 수 없습니다.' };
    }

    const response = await authAPI.getGoogleAccessToken({
      codeVerifier: '',
      authorizationCode: userInfo.data.serverAuthCode,
      redirectUri: '',
      platform: 'ANDROID',
    });

    console.log('response: ', response);
    const { accessToken, refreshToken } = parseAuthToken(response);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    return { errorMessage: 'Google 로그인 중 오류가 발생했습니다.' };
  }
};
