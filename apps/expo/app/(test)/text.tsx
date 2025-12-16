import { useLanguage } from '@src/lib/i18n';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Text } from '@nyangtodac/ui';

export default function TextPage() {
  const { language } = useLanguage();

  const url = `http://localhost:3000/text?lang=${language}`;

  return (
    <View className="gap-2 p-4">
      <Text
        tx="hello"
        className="text-title-large text-body"
      />
      <Text
        tx="hello"
        className="text-title-medium text-body"
      />
      <Text
        tx="hello"
        className="text-title-small text-body"
      />

      <Text
        tx="hello"
        className="text-body-large text-body"
      />
      <Text
        tx="hello"
        className="text-body-medium text-body"
      />
      <Text
        tx="hello"
        className="text-body-small text-body"
      />

      <Text
        tx="hello"
        className="text-label-large text-body"
      />
      <Text
        tx="hello"
        className="text-label-medium text-body"
      />
      <Text
        tx="hello"
        className="text-label-small text-body"
      />
      <View className="w-full h-1/2 mt-2">
        <WebView source={{ uri: url }} />
      </View>
    </View>
  );
}
