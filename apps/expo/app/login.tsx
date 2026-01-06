import { Text } from '@pado/ui';
import { Image, Pressable, View } from '@src/components/ui';
import { WaveHorizon } from '@src/features/home';
import { SignInWithGoogle, SignInWithKakao } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    await SignInWithGoogle();
    router.push(ROUTES.HOME);
  };

  const handleKakaoLogin = async () => {
    await SignInWithKakao();
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
          className="bg-page rounded-t-[32px] px-6 pt-8 flex gap-4 flex-col"
          style={{ paddingBottom: insets.bottom + scale(32) }}
        >
          <Pressable
            onPress={handleGoogleLogin}
            className="bg-white rounded-[32px] border border-gray-200 flex-row items-center justify-center py-5 gap-2"
          >
            <Image
              source={require('../assets/images/login/google.svg')}
              className="w-6 h-6"
            />
            <Text className="text-body-medium">구글로 계속하기</Text>
          </Pressable>

          <Pressable
            onPress={handleKakaoLogin}
            className="bg-[#FEE500] rounded-[32px] flex-row items-center justify-center py-5 gap-2"
          >
            <Image
              source={require('../assets/images/login/kakao.svg')}
              className="w-6 h-6"
            />
            <Text className="text-body-medium">카카오톡으로 계속하기</Text>
          </Pressable>
          <Text className="text-body-small text-center text-sub">
            계속 진행하면 파도의 서비스 약관 및 개인 정보 정책에 동의하는 것으로
            간주됩니다.
          </Text>
        </View>
      </View>
    </View>
  );
}
