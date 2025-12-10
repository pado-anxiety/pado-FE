import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@nyangtodac/ui';

export default function HomeScreen(): React.ReactNode {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Text className="text-2xl font-bold text-success">{t('hello')}</Text>
      <Button
        text="change language"
        onPress={() => router.push('/(pages)/lang')}
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
      <Button
        text="text page"
        onPress={() => router.push('/(pages)/text')}
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
      <Button
        text="modal page"
        onPress={() => router.push('/(pages)/modal')}
        color="primary"
        size="default"
        disabled={false}
        fullWidth={false}
      />
    </View>
  );
}
