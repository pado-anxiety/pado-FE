import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Image, Pressable, Text, View } from '@src/components/ui';
import { useAnalytics } from '@src/lib/analytics';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';

import { LearningItem } from '../../home/types';

type LearningCardProps = {
  item: LearningItem;
};

export function LearningCard({ item }: LearningCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const { trackContent } = useAnalytics();

  const getAnalyticsKey = (subject: string) => {
    return t(`learning.${subject}.analyticsKey`);
  };

  return (
    <Animated.View
      entering={FadeIn.delay(1000)}
      className="mx-4 my-4 flex flex-col rounded-2xl bg-act-page"
    >
      <Pressable
        onPress={() => {
          triggerHaptic('NAVIGATE');
          trackContent(getAnalyticsKey(item.subject));
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
          <Text className="text-body-medium">
            {t(`learning.${item.subject}.title`)}
          </Text>
          <Text className="text-body-small">
            {t(`learning.${item.subject}.description`)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
