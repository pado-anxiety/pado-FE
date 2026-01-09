import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Button } from '@pado/ui';

export default function ButtonPage() {
  return (
    <View>
      <Button
        text="button"
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
      <View className="mt-2 h-1/2 w-full">
        <WebView
          source={{ uri: 'http://localhost:3000' }}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
        />
      </View>
    </View>
  );
}
