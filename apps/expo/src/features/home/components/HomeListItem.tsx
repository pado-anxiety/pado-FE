import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Pressable, Text, View } from '@src/components/ui';
import HistoryCard from '@src/features/History/HistoryCard';
import { ACTType } from '@src/features/History/types';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';

import { HomeListItem as HomeListItemType } from '../types';
import { DeepSeaSection } from './DeepSeaSection';

interface HomeListItemProps {
  item: HomeListItemType;
  handleModalOpen: (id: number, type: ACTType, date: string) => void;
}

export const HomeListItem = ({ item, handleModalOpen }: HomeListItemProps) => {
  const router = useRouter();

  if (item.type === 'HOME') {
    return <DeepSeaSection key="home-sea" />;
  } else if (item.type === 'HISTORY') {
    return (
      <HistoryCard
        item={item}
        handleModalOpen={handleModalOpen}
      />
    );
  } else if (item.type === 'LEARNING') {
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
          <View className="aspect-[3/2] w-full rounded-t-2xl bg-blue-400" />
          <View className="p-4">
            <Text className="text-body-medium">{item.title}</Text>
            <Text className="text-body-small">{item.description}</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
  return null;
};
