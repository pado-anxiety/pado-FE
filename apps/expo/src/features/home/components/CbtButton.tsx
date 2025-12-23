import { Text } from '@src/components/ui';
import { Href, useRouter } from 'expo-router';
import { Dimensions, Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';

const ITEM_SIZE = Dimensions.get('window').width / 3 - scale(10);

type CbtButtonProps = {
  item: {
    label: string;
    slug: string;
  };
};

export function CbtButton({ item }: CbtButtonProps): React.ReactNode {
  const router = useRouter();

  return (
    <Pressable
      style={{ width: ITEM_SIZE - 10, height: ITEM_SIZE - 10 }}
      className="max-w-[150px] aspect-square bg-neutral-200 border-[3px] border-solid border-blue-200 justify-center items-center rounded-xl"
      onPress={() => {
        router.push(`/(cbt)/${item.slug}` as Href);
      }}
    >
      <Text className="text-body-large">{item.label}</Text>
    </Pressable>
  );
}
