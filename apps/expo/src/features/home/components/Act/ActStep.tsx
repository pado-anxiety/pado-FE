import { Pressable, Text, View } from '@src/components/ui';
import { Href, useRouter } from 'expo-router';

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
          router.push(`/(act)/${item.slug}` as Href);
        }}
      >
        <Text className="text-body-large">{item.label}</Text>
      </Pressable>
    </View>
  );
}
