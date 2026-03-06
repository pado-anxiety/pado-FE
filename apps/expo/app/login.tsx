import { useRef } from 'react';

import { getLocales } from 'expo-localization';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { Image, Pressable, Text, View } from '@src/components/ui';
import { WaveHorizon } from '@src/features/home';
import { showAlert } from '@src/lib/alert';
import { useAnalytics } from '@src/lib/analytics';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

const BYPASS_TAP_COUNT = 5;
const BYPASS_TIME_WINDOW = 5000;

export default function LoginScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { login, setAuthToken, setUserInfo } = useAuth();
  const router = useRouter();

  const { trackLoginAttempt, trackLoginSuccess, trackLoginFail } = useAnalytics();
  const tapTimestamps = useRef<number[]>([]);

  const colorScheme = useColorScheme();
  const regionCode = getLocales()[0]?.regionCode;
  const isKakaoAvailable = regionCode === 'KR';

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

  const handleLogin = async (method: 'apple' | 'google' | 'kakao') => {
    trackLoginAttempt(method);
    const result = await login(method);
    if (result && 'cancelled' in result) return;
    if (result && 'errorMessage' in result) {
      trackLoginFail(method, result.errorMessage);
      showAlert.error(result.errorMessage, t('common.error.tryLater'));
      return;
    }
    trackLoginSuccess(method);
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
        className="flex-1 flex-col justify-between"
        style={{ marginTop: -scale(10) }}
      >
        <View
          className="flex-1 items-center justify-center gap-4 px-8"
          style={{ marginTop: -scale(100) }}
        >
          <Pressable onPress={handleBypassTap}>
            <Text
              className="text-white"
              bold
              style={{ fontSize: 36, lineHeight: 44 }}
            >
              {t('home.app.name')}
            </Text>
          </Pressable>
          <View className="flex-col items-center justify-center text-center">
            <Text
              className="text-white"
              preset="heading"
            >
              {t('home.app.tagline1')}
            </Text>
            <Text
              className="text-center text-white"
              preset="heading"
            >
              {t('home.app.tagline2')}
            </Text>
            <Text
              className="text-center text-white"
              preset="heading"
            >
              {t('home.app.description')}
            </Text>
          </View>
        </View>

        <View
          className="flex flex-col gap-4 rounded-t-[32px] bg-page px-6 pt-8"
          style={{
            paddingBottom: insets.bottom + scale(32),
            backgroundColor: colorScheme === 'dark' ? '#242428ff' : '#f1f1f1ff',
          }}
        >
          <Pressable
            onPress={() => handleLogin('apple')}
            className="flex-row items-center justify-center gap-2 rounded-[32px] bg-black py-5"
          >
            <Image
              source={require('../assets/images/login/apple.png')}
              className="h-6 w-6"
              contentFit="contain"
            />
            <Text
              className="text-white"
              preset="heading"
            >
              {t('auth.login.continueWithApple')}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleLogin('google')}
            className="flex-row items-center justify-center gap-2 rounded-[32px] border border-gray-200 bg-white py-5"
          >
            <Image
              source={require('../assets/images/login/google.svg')}
              className="h-6 w-6"
              contentFit="contain"
            />
            <Text
              preset="heading"
              className="text-slate-800"
            >
              {t('auth.login.continueWithGoogle')}
            </Text>
          </Pressable>

          {isKakaoAvailable && (
            <Pressable
              onPress={() => handleLogin('kakao')}
              className="flex-row items-center justify-center gap-2 rounded-[32px] bg-[#FEE500] py-5"
            >
              <Image
                source={require('../assets/images/login/kakao.svg')}
                className="h-6 w-6"
                contentFit="contain"
              />
              <Text
                preset="heading"
                className="text-slate-800"
              >
                {t('auth.login.continueWithKakao')}
              </Text>
            </Pressable>
          )}
          <Text
            className="text-center text-sub"
            preset="sub"
          >
            {t('auth.login.termsAgreement')}
          </Text>
        </View>
      </View>
    </View>
  );
}
