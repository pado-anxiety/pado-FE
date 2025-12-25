import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { ENV } from '../env';

const base64UrlEncode = (str: string): string => {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const generateCodeVerifier = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);

  const base64String = btoa(String.fromCharCode(...randomBytes));

  return base64UrlEncode(base64String);
};

export const generateCodeChallenge = async (
  codeVerifier: string,
): Promise<string> => {
  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );

  return base64UrlEncode(hashed);
};

export const getGoogleClientId = () => {
  if (Platform.OS === 'ios') {
    return ENV.IOS_GOOGLE_CLIENT_ID;
  }
};

export const handleGoogleLogin = async () => {
  try {
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const redirectUri =
      Platform.OS === 'ios'
        ? ENV.IOS_REDIRECT_URI
        : Linking.createURL('callback');
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

    console.log('result: ', result);

    if (result.type === 'success' && result.url) {
      const params = Linking.parse(result.url).queryParams;
      const authCode = params?.code;

      if (authCode) {
        // 백엔드 전송할 인증코드
        console.log('authCode: ', authCode);
      } else {
        throw new Error('Google login failed');
      }
    }
  } catch (error) {
    console.error('Google login error: ', error);
    throw error;
  }
};
