import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { authAPI } from '../api/auth';
import { ENV } from '../env';
import { useAuth } from './auth-context';
import {
  generateCodeChallenge,
  generateCodeVerifier,
  getGoogleClientId,
} from './pkce';
import { parseGoogleAuthToken } from './utils';

export const SignInWithGoogle = async () => {
  if (Platform.OS === 'ios') {
    await SignInWithGoogleOnIOS();
  } else {
    await SignInWithGoogleOnAndroid();
  }
};

const SignInWithGoogleOnIOS = async () => {
  const codeVerifier = await generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  try {
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

    if (result.type === 'success' && result.url) {
      const params = Linking.parse(result.url).queryParams;
      const authCode = params?.code;

      if (authCode && typeof authCode === 'string') {
        const response = await authAPI.getGoogleAccessToken({
          codeVerifier,
          authorizationCode: authCode,
          redirectUri,
          platform: 'IOS',
        });

        console.log(response);

        const { accessToken, refreshToken } = parseGoogleAuthToken(response);
        useAuth.getState().login(accessToken, refreshToken);
      } else {
        throw new Error('iOS Google login failed');
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const SignInWithGoogleOnAndroid = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    if (userInfo?.data && userInfo.data.serverAuthCode) {
      const response = await authAPI.getGoogleAccessToken({
        codeVerifier: '',
        authorizationCode: userInfo.data.serverAuthCode,
        redirectUri: '',
        platform: 'ANDROID',
      });

      console.log('response: ', response);
    } else {
      throw new Error('Android Google login failed');
    }
  } catch (error) {
    console.log(error);
  }
};
