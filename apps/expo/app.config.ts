import type { ConfigContext, ExpoConfig } from 'expo/config';

import env, { ClientEnv } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: ClientEnv.NAME,
  slug: ClientEnv.SLUG,
  version: ClientEnv.VERSION,
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: ClientEnv.SCHEME,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  locales: {
    en: './languages/en.json',
    ko: './languages/ko.json',
  },
  ios: {
    icon: './assets/icon.png',
    supportsTablet: false,
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      CFBundleLocalizations: ['en', 'ko'],
      CFBundleDisplayName: ClientEnv.NAME,
      UIBackgroundModes: ['remote-notification'],
      ITSAppUsesNonExemptEncryption: false,
    },
    usesAppleSignIn: true,
    entitlements: {
      'aps-environment': 'production',
    },
    googleServicesFile: './GoogleService-Info.plist',
    bundleIdentifier: ClientEnv.IOS_BUNDLE_IDENTIFIER,
    splash: {
      backgroundColor: '#F5F5F5',
      dark: {
        backgroundColor: '#1E1F28',
      },
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    splash: {
      backgroundColor: '#F5F5F5',
      dark: {
        backgroundColor: '#1E1F28',
      },
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
    '@react-native-firebase/app',
    '@react-native-firebase/messaging',
    './plugins/withModularHeaders',
    [
      '@sentry/react-native/expo',
      {
        organization: 'taewoong-heo',
        project: 'pado',
      },
    ],
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
        backgroundColor: '#F5F5F5',
        dark: {
          backgroundColor: '#1E1F28',
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
    SENTRY_DSN:
      'https://8cd430bfd56b4ee468174ef67db0418f@o4510090058792960.ingest.us.sentry.io/4510837084585984',
  },
  updates: {
    url: 'https://u.expo.dev/30195066-b4b9-406a-9236-c2eaa162bf54',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
