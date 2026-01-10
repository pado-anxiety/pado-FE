import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { Pressable, Text, View } from '@src/components/ui';

export default function LicenseScreen() {
  const router = useRouter();

  const dependencies = [
    '@expo/vector-icons ^15.0.3',
    '@gorhom/bottom-sheet ^5',
    '@hookform/resolvers ^5.2.2',
    '@pado/bridge workspace:*',
    '@pado/i18n workspace:*',
    '@react-native-community/blur ^4.4.1',
    '@react-native-cookies/cookies ^6.2.1',
    '@react-native-google-signin/google-signin ^16.1.1',
    '@react-native-seoul/kakao-login ^5.4.2',
    '@react-navigation/bottom-tabs ^7.4.0',
    '@react-navigation/elements ^2.6.3',
    '@react-navigation/native ^7.1.8',
    '@shopify/react-native-skia 2.2.12',
    '@tanstack/react-query ^5.90.12',
    'axios ^1.13.2',
    'dotenv ^17.2.3',
    'expo ^54.0.27',
    'expo-constants ^18.0.11',
    'expo-crypto ~15.0.8',
    'expo-dev-client ^6.0.20',
    'expo-font ~14.0.10',
    'expo-haptics ~15.0.8',
    'expo-image ^3.0.11',
    'expo-linking ~8.0.9',
    'expo-localization ^17.0.8',
    'expo-router ~6.0.16',
    'expo-splash-screen ~31.0.11',
    'expo-status-bar ~3.0.8',
    'expo-symbols ~1.0.7',
    'expo-system-ui ~6.0.8',
    'expo-updates ~29.0.15',
    'expo-web-browser ~15.0.9',
    'i18next ^25.7.1',
    'nativewind ^4.2.1',
    'react 19.1.0',
    'react-dom 19.1.0',
    'react-hook-form ^7.68.0',
    'react-i18next ^16.4.0',
    'react-native 0.81.5',
    'react-native-gesture-handler ~2.28.0',
    'react-native-keyboard-controller ^1.20.1',
    'react-native-mmkv ^4.1.0',
    'react-native-nitro-modules ^0.31.10',
    'react-native-reanimated ~4.1.1',
    'react-native-safe-area-context ~5.6.0',
    'react-native-screens ~4.16.0',
    'react-native-size-matters ^0.4.2',
    'react-native-webview ^13.16.0',
    'react-native-worklets 0.5.1',
    'tailwind-merge ^3.4.0',
    'zod ^4.1.13',
    'zustand ^5.0.9',
  ];

  const devDependencies = [
    '@pado/eslint-config-custom workspace:*',
    '@pado/locales workspace:*',
    '@pado/tailwind-design-tokens workspace:*',
    '@pado/tailwind-semantic-tokens workspace:*',
    '@pado/ui workspace:*',
    '@tanstack/eslint-plugin-query ^5.91.2',
    '@trivago/prettier-plugin-sort-imports ^6.0.0',
    '@types/react ~19.1.0',
    'cross-env ^10.1.0',
    'eslint ^9.25.0',
    'eslint-config-expo ~10.0.0',
    'prettier ^3.7.4',
    'prettier-plugin-tailwindcss ^0.5.11',
    'tailwind-variants ^3.2.2',
    'tailwindcss ^3.4.17',
  ];

  return (
    <PageSafeAreaView className="bg-page px-8">
      <ScrollView
        className="mt-4 flex-1"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()}>
          <Feather
            name="arrow-left"
            size={scale(30)}
            color="black"
          />
        </Pressable>
        <View className="mt-4 gap-6 pb-8">
          <Text className="text-body-medium font-bold">라이선스 정보</Text>

          <Text className="text-body-small">
            본 앱은 아래의 오픈소스 라이브러리를 사용하고 있습니다.
          </Text>

          <View className="gap-3">
            {dependencies.map((dep, index) => (
              <Text
                key={index}
                className="text-body-small"
              >
                • {dep}
              </Text>
            ))}
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              DevDependencies
            </Text>
            {devDependencies.map((dep, index) => (
              <Text
                key={index}
                className="text-body-small"
              >
                • {dep}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </PageSafeAreaView>
  );
}
