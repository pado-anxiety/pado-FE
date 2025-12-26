import { Pressable, Text, View } from '@src/components/ui';
import { handleGoogleLogin } from '@src/lib/auth';

export default function HomeScreen(): React.ReactNode {
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable onPress={handleGoogleLogin}>
        <Text>Get Access Token</Text>
      </Pressable>
    </View>
  );
}
