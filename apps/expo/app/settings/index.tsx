import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { Pressable, Text, View } from '@src/components/ui';
import { ENV } from '@src/lib';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <PageSafeAreaView className="mt-4 bg-page px-8">
      <Pressable
        className="flex flex-row items-center justify-between gap-2"
        onPress={() => router.back()}
      >
        <Feather
          name="arrow-left"
          size={scale(24)}
          color="black"
        />
        <Text className="text-body-large">설정</Text>
        <Feather
          name="arrow-left"
          size={scale(24)}
          color="transparent"
        />
      </Pressable>
      <View className="mt-4 flex flex-col">
        <Pressable
          onPress={() => router.push(ROUTES.SETTINGS.LANGUAGE)}
          className="flex flex-row items-center border-b border-gray-300 py-4"
        >
          {/* <Feather
            name="globe"
            size={scale(20)}
            color="black"
          /> */}
          <Text className="text-body-small">언어 설정</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(ROUTES.SETTINGS.VIBRATION)}
          className="flex flex-row items-center gap-2 border-b border-gray-300 py-4"
        >
          {/* <MaterialCommunityIcons
            name="vibrate"
            size={24}
            color="black"
          /> */}
          <Text className="text-body-small">진동</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(ROUTES.SETTINGS.PRIVACY_POLICY)}
          className="flex flex-row items-center gap-2 border-b border-gray-300 py-4"
        >
          {/* <Feather
            name="shield"
            size={scale(20)}
            color="black"
          /> */}
          <Text className="text-body-small">개인정보 처리 방침</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(ROUTES.SETTINGS.TERMS_OF_SERVICE)}
          className="flex flex-row items-center gap-2 border-b border-gray-300 py-4"
        >
          {/* <Feather
            name="file-text"
            size={scale(20)}
            color="black"
          /> */}
          <Text className="text-body-small">이용약관</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(ROUTES.SETTINGS.LICENSE_INFO)}
          className="flex flex-row items-center gap-2 py-4"
        >
          {/* <Feather
            name="file-text"
            size={scale(20)}
            color="black"
          /> */}
          <Text className="text-body-small">앱 버전 {ENV.VERSION}</Text>
          <Text className="text-body-small text-sub">라이선스 정보</Text>
        </Pressable>
      </View>
      <View className="mt-12 flex flex-row items-center justify-center">
        <Pressable onPress={handleLogout}>
          <Text className="text-body-small text-destructive">로그아웃</Text>
        </Pressable>
      </View>
    </PageSafeAreaView>
  );
}
