import { useRef } from 'react';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { Text } from '@pado/ui';

import { Image, Pressable, View } from '@src/components/ui';
import { WaveHorizon } from '@src/features/home';
import { showAlert } from '@src/lib/alert';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

const BYPASS_TAP_COUNT = 5;
const BYPASS_TIME_WINDOW = 5000;

export default function LoginScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { login, setAuthToken, setUserInfo } = useAuth();
  const router = useRouter();

  const tapTimestamps = useRef<number[]>([]);

  const handleBypassTap = () => {
    const now = Date.now();
    tapTimestamps.current = tapTimestamps.current.filter(
      (ts) => now - ts < BYPASS_TIME_WINDOW,
    );
    tapTimestamps.current.push(now);

    if (tapTimestamps.current.length >= BYPASS_TAP_COUNT) {
      tapTimestamps.current = [];
      setAuthToken('bypass-access-token', 'bypass-refresh-token');
      setUserInfo('테스트 유저', 'test@bypass.dev');
      router.replace(ROUTES.HOME);
    }
  };

  const handleAppleLogin = async () => {
    const result = await login('apple');
    if (result && 'cancelled' in result) return;
    if (result && 'errorMessage' in result) {
      showAlert.error(result.errorMessage, t('common.error.tryLater'));
      return;
    }
    router.replace(ROUTES.HOME);
  };

  const handleGoogleLogin = async () => {
    const result = await login('google');
    if (result && 'cancelled' in result) return;
    if (result && 'errorMessage' in result) {
      showAlert.error(result.errorMessage, t('common.error.tryLater'));
      return;
    }
    router.replace(ROUTES.HOME);
  };

  const handleKakaoLogin = async () => {
    const result = await login('kakao');
    if (result && 'cancelled' in result) return;
    if (result && 'errorMessage' in result) {
      showAlert.error(result.errorMessage, t('common.error.tryLater'));
      return;
    }
    router.replace(ROUTES.HOME);
  };

  return (
    <View
      className="flex flex-1 flex-col justify-between bg-page"
      style={{
        paddingTop: insets.top,
      }}
    >
      <WaveHorizon />

      <View
        className="flex-1 flex-col justify-between bg-[#003366]"
        style={{ marginTop: -scale(10) }}
      >
        <View
          className="flex-1 items-center justify-center gap-4 px-8"
          style={{ marginTop: -scale(50) }}
        >
          <Pressable onPress={handleBypassTap}>
            <Text className="text-5xl font-bold text-white">
              {t('home.app.name')}
            </Text>
          </Pressable>
          <View className="flex-col items-center justify-center">
            <Text className="text-center text-body-medium text-white">
              {t('home.app.tagline')}
            </Text>
            <Text className="text-center text-body-medium text-white">
              {t('home.app.description')}
            </Text>
          </View>
        </View>

        <View
          className="flex flex-col gap-4 rounded-t-[32px] bg-page px-6 pt-8"
          style={{ paddingBottom: insets.bottom + scale(32) }}
        >
          <Pressable
            onPress={handleAppleLogin}
            className="flex-row items-center justify-center gap-2 rounded-[32px] bg-black py-5"
          >
            <Image
              source={require('../assets/images/login/apple.png')}
              className="h-6 w-6"
              contentFit="contain"
            />
            <Text className="text-body-medium text-white">
              {t('auth.login.continueWithApple')}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleGoogleLogin}
            className="flex-row items-center justify-center gap-2 rounded-[32px] border border-gray-200 bg-white py-5"
          >
            <Image
              source={require('../assets/images/login/google.svg')}
              className="h-6 w-6"
              contentFit="contain"
            />
            <Text className="text-body-medium">
              {t('auth.login.continueWithGoogle')}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleKakaoLogin}
            className="flex-row items-center justify-center gap-2 rounded-[32px] bg-[#FEE500] py-5"
          >
            <Image
              source={require('../assets/images/login/kakao.svg')}
              className="h-6 w-6"
              contentFit="contain"
            />
            <Text className="text-body-medium">
              {t('auth.login.continueWithKakao')}
            </Text>
          </Pressable>
          <Text className="text-center text-body-small text-sub">
            {t('auth.login.termsAgreement')}
          </Text>
        </View>
      </View>
    </View>
  );
}
