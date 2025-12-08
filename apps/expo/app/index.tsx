import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@nyangtodac/ui';

export default function HomeScreen(): React.ReactNode {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Text className="text-2xl font-bold text-success">Home</Text>
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
