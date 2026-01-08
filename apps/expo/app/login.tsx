import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { Text } from '@pado/ui';

import { Image, Pressable, View } from '@src/components/ui';
import { WaveHorizon } from '@src/features/home';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

export default function LoginScreen() {
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
          <Text className="text-5xl font-bold text-white">파도</Text>
          <View className="flex-col items-center">
            <Text className="text-body-medium text-white">
              내 안의 파도를 마주하는 시간
            </Text>
            <Text className="text-body-medium text-white">
              ACT 기반 불안 관리 앱
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
            <Text className="text-body-medium">구글로 계속하기</Text>
          </Pressable>

          <Pressable
            onPress={handleKakaoLogin}
            className="flex-row items-center justify-center gap-2 rounded-[32px] bg-[#FEE500] py-5"
          >
            <Image
              source={require('../assets/images/login/kakao.svg')}
              className="h-6 w-6"
            />
            <Text className="text-body-medium">카카오톡으로 계속하기</Text>
          </Pressable>
          <Text className="text-center text-body-small text-sub">
            계속 진행하면 파도의 서비스 약관 및 개인 정보 정책에 동의하는 것으로
            간주됩니다.
          </Text>
        </View>
      </View>
    </View>
  );
}
