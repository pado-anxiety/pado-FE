import { Pressable, Text, View } from '@src/components/ui';
import { getActRoute } from '@src/lib/route';
import { useRouter } from 'expo-router';

type ActButtonProps = {
  item: {
    label: string;
    slug: string;
    position: number;
  };
};

export function ActStep({ item }: ActButtonProps): React.ReactNode {
  const router = useRouter();

  return (
    <View
      className="flex-row w-full gap-4"
      style={{ marginLeft: item.position }}
    >
      {/* <Text className="text-body-large bg-white">{item.label}</Text> */}
      <Pressable
        className="bg-white p-4 rounded-lg"
        onPress={() => {
          router.push(getActRoute(item.slug));
        }}
      >
        <Text className="text-body-large">{item.label}</Text>
      </Pressable>
    </View>
  );
}
