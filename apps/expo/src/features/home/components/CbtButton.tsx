import { Text } from '@src/components/ui';
import { getCbtRoute } from '@src/lib/route/route';
import { useRouter } from 'expo-router';
import { Pressable, useWindowDimensions } from 'react-native';
import { scale } from 'react-native-size-matters';

type CbtButtonProps = {
  item: {
    label: string;
    slug: string;
  };
};

export function CbtButton({ item }: CbtButtonProps): React.ReactNode {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const ITEM_SIZE = width / 3 - scale(10);

  return (
    <Pressable
      style={{ width: ITEM_SIZE - 10, height: ITEM_SIZE - 10 }}
      className="max-w-[150px] aspect-square bg-neutral-200 border-[3px] border-solid border-blue-200 justify-center items-center rounded-xl"
      onPress={() => {
        router.push(getCbtRoute(item.slug));
      }}
    >
      <Text className="text-body-large">{item.label}</Text>
    </Pressable>
  );
}
