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
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
    bundler: 'metro',
  },
  plugins: [
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
    ...env.ClientEnv,
  },
});
