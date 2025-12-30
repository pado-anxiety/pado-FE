import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

import { ENV } from '../env';

GoogleSignin.configure({
  webClientId: ENV.WEB_CLIENT_ID,
  iosClientId: ENV.IOS_GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

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
