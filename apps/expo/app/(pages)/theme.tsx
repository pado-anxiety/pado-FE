import { useTheme } from '@src/lib/theme';
import { View } from 'react-native';
import WebView from 'react-native-webview';

import { Button, Text } from '@nyangtodac/ui';

export default function ThemePage() {
  const { theme, changeTheme } = useTheme();

  const url = `http://localhost:3000/?theme=${theme}`;

  console.log('url', url);
  return (
    <View className={`flex-1 items-center justify-center gap-4 bg-page`}>
      <Text className="text-2xl font-bold text-body">Theme: {theme}</Text>
      <Button
        onPress={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
        text="change theme"
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
      <View className="w-full h-1/2 mt-2">
        <WebView source={{ uri: url }} />
      </View>
    </View>
  );
}
