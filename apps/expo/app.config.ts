import type { ConfigContext, ExpoConfig } from 'expo/config';

import env, { ClientEnv } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: ClientEnv.NAME,
  slug: ClientEnv.SLUG,
  version: ClientEnv.VERSION,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: ClientEnv.SCHEME,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    infoPlist: {
      CFBundleLocalizations: ['en', 'ko'],
      CFBundleDisplayName: ClientEnv.NAME,
    },
    bundleIdentifier: ClientEnv.IOS_BUNDLE_IDENTIFIER,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    package: ClientEnv.ANDROID_PACKAGE,
    googleServicesFile: './google-services.json',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-audio',
      {
        playsInSilentModeIOS: true,
        interruptionModeIOS: 'DoNotMix',
        allowsRecordingIOS: false,
      },
    ],
    [
      '@react-native-seoul/kakao-login',
      {
        kakaoAppKey: '1121c212a27ee8d00ca1ff02afe0df39',
        overrideKotlinVersion: '1.9.0',
      },
    ],
    [
      'expo-dev-client',
      {
        launchMode: 'most-recent',
      },
    ],
    [
      'expo-localization',
      {
        supportedLocales: {
          ios: ['en', 'ko'],
          android: ['en', 'ko'],
        },
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: '30195066-b4b9-406a-9236-c2eaa162bf54',
    },
    ...env.ClientEnv,
    BASE_URL: 'https://pado-anxiety.site',
    IOS_WEBVIEW_URL: 'https://nyangtodac-web-fe.pages.dev/',
    ANDROID_WEBVIEW_URL: 'https://nyangtodac-web-fe.pages.dev/',
    // IOS_WEBVIEW_URL: 'http://localhost:3000',
    // ANDROID_WEBVIEW_URL: 'http://10.0.2.2:3000',
  },
  updates: {
    url: 'https://u.expo.dev/30195066-b4b9-406a-9236-c2eaa162bf54',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
