import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { Text } from '@pado/ui';

import { Image, Pressable, View } from '@src/components/ui';
import { WaveHorizon } from '@src/features/home';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

export default function LoginScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const result = await login('google');
    if (result && 'errorMessage' in result) {
      Alert.alert(result.errorMessage);
      return;
    }
    router.push(ROUTES.HOME);
  };

  const handleKakaoLogin = async () => {
    const result = await login('kakao');
    if (result && 'errorMessage' in result) {
      Alert.alert(result.errorMessage);
      return;
    }
    console.log(useAuth.getState().accessToken);
    console.log(useAuth.getState().refreshToken);
    router.push(ROUTES.HOME);
  };

  return (
    <View
      className="flex flex-1 flex-col justify-between"
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
          className="flex-1 items-center gap-4"
          style={{ marginTop: -scale(50) }}
        >
          <Text className="text-5xl font-bold text-white">
            {t('home.app.name')}
          </Text>
          <View className="flex-col items-center">
            <Text className="text-body-medium text-white">
              {t('home.app.tagline')}
            </Text>
            <Text className="text-body-medium text-white">
              {t('home.app.description')}
            </Text>
          </View>
        </View>

        <View
          className="flex flex-col gap-4 rounded-t-[32px] bg-page px-6 pt-8"
          style={{ paddingBottom: insets.bottom + scale(32) }}
        >
          <Pressable
            onPress={handleGoogleLogin}
            className="flex-row items-center justify-center gap-2 rounded-[32px] border border-gray-200 bg-white py-5"
          >
            <Image
              source={require('../assets/images/login/google.svg')}
              className="h-6 w-6"
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
