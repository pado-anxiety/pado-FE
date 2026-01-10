import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { Pressable, Text } from '@src/components/ui';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <PageSafeAreaView className="gap-2 bg-page px-8">
      <Pressable onPress={() => router.back()}>
        <Feather
          name="arrow-left"
          size={scale(30)}
          color="black"
        />
      </Pressable>
      <Text className="text-title-medium">개인정보 처리 방침</Text>
    </PageSafeAreaView>
  );
}
