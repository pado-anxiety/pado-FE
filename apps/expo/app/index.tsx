import { changeLanguage, getLanguage, storage } from '@src/lib/i18n/utils';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@nyangtodac/ui';

export default function HomeScreen(): React.ReactNode {
  const router = useRouter();
  const { t } = useTranslation();

  console.log(storage.getString('language'));

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Text className="text-2xl font-bold text-success">{t('hello')}</Text>
      <Button
        text="change language"
        onPress={() => changeLanguage(getLanguage() === 'en' ? 'ko' : 'en')}
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
      <Button
        text="button page"
        onPress={() => router.push('/(pages)/button')}
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
      <Button
        text="form page"
        onPress={() => router.push('/(pages)/form')}
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
    </View>
  );
}
