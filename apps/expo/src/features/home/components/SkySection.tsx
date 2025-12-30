import { useState } from 'react';

import { getProfile, login } from '@react-native-seoul/kakao-login';
import { Button, Text, View } from '@src/components/ui';
import { ENV } from '@src/lib/env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WAVE_LAYOUT } from '../constants';

export function SkySection(): React.ReactNode {
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState<string | null>(null);
  const signInWithKakao = async () => {
    try {
      // 1. 카카오 로그인 요청 (카카오톡 앱 실행)
      const token = await login();
      console.log('카카오 액세스 토큰:', token.accessToken);

      // 2. (선택사항) 프로필 정보 가져오기
      const profile = await getProfile();
      console.log('사용자 프로필:', profile);

      setToken(token.accessToken);
      // 3. 백엔드로 토큰 전송
      // await sendTokenToBackend(token.accessToken);
    } catch (err) {
      console.error('로그인 중 에러 발생:', err);
    }
  };

  return (
    <View
      className="bg-white items-center justify-center gap-4"
      style={{
        height: WAVE_LAYOUT.SKY_HEIGHT,
        paddingTop: insets.top,
      }}
    >
      <Text>Sky</Text>
      <Text>{ENV.BASE_URL}</Text>
      <Text>{ENV.IOS_WEBVIEW_URL}</Text>
      <Text>{ENV.ANDROID_WEBVIEW_URL}</Text>
      <Button
        onPress={signInWithKakao}
        text="Login"
        fullWidth={false}
        className="px-4"
      />
      <Text>토큰: {token}</Text>
    </View>
  );
}
