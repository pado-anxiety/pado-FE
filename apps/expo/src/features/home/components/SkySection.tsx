import { Button, Text, View } from '@src/components/ui';
import { useAuth } from '@src/lib/auth';
import { ENV } from '@src/lib/env';
import { ROUTES } from '@src/lib/route';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WAVE_LAYOUT } from '../constants';

export function SkySection(): React.ReactNode {
  const insets = useSafeAreaInsets();
  const { accessToken, refreshToken, isLoggedIn, logout } = useAuth();

  return (
    <View
      className="bg-white items-center justify-center gap-4"
      style={{
        height: WAVE_LAYOUT.SKY_HEIGHT,
        paddingTop: insets.top,
      }}
    >
      <Text>{ENV.BASE_URL}</Text>
      <Text>{ENV.IOS_WEBVIEW_URL}</Text>
      <Text>{ENV.ANDROID_WEBVIEW_URL}</Text>
      <Text>{accessToken}</Text>
      <Text>{refreshToken}</Text>
      <Text>{isLoggedIn ? 'Logged In' : 'Logged Out'}</Text>
      <Button
        text="logout"
        onPress={() => logout()}
      />
      <Button
        text="login"
        onPress={() => router.replace(ROUTES.LOGIN)}
      />
    </View>
  );
}
