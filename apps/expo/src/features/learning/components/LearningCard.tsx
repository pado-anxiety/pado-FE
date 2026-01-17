import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Image, Pressable, Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';

import { LearningItem } from '../../home/types';

type LearningCardProps = {
  item: LearningItem;
};

export function LearningCard({ item }: LearningCardProps) {
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeIn.delay(1000)}
      className="mx-4 my-4 flex flex-col rounded-2xl bg-act-page"
    >
      <Pressable
        onPress={() => {
          triggerHaptic('NAVIGATE');
          router.push({
            pathname: ROUTES.LEARNING,
            params: {
              subject: item.subject,
              title: item.title,
              description: item.description,
            },
          });
        }}
      >
        <Image
          source={item.image}
          className="aspect-[3/2] w-full rounded-t-2xl"
          contentFit="cover"
        />
        <View className="p-4">
          <Text className="text-body-medium">{item.title}</Text>
          <Text className="text-body-small">{item.description}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
