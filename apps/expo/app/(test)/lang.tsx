import { useLanguage } from '@src/lib/i18n/utils';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Button } from '@pado/ui';

export default function LangPage() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const url = `http://localhost:3000/lang?lang=${language}`;

  return (
    <View>
      <Text>Language change with WebView</Text>
      <Button
        text="change language"
        onPress={() => {
          changeLanguage(language === 'en' ? 'ko' : 'en');
        }}
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
      <Text className="text-2xl font-bold text-primary-300">
        Native view text: {t('hello')}
      </Text>
      <View className="w-full h-full mt-2">
        <WebView source={{ uri: url }} />
      </View>
    </View>
  );
}
