import { Text, View } from '@src/components/ui';
import { ENV } from '@src/lib/env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WAVE_LAYOUT } from '../constants';

export function SkySection(): React.ReactNode {
  const insets = useSafeAreaInsets();

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
    </View>
  );
}
