import { useState } from 'react';

import catDefaultImage from '@assets/images/cat/default_shadow.webp';
import backgroundImage from '@assets/images/home/background.webp';
import { Image, Text, View } from '@src/components/ui';
import { ChatScreen } from '@src/features/chat';
import { Href, useRouter } from 'expo-router';
import { Dimensions, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function HomeScreen(): React.ReactNode {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const ITEM_SIZE = Dimensions.get('window').width / 3 - scale(10);

  const [data, _] = useState([
    {
      label: '인지재구성',
      slug: 'recognition',
    },
    {
      label: '호흡법',
      slug: 'breathing',
    },
    {
      label: '진정문구',
      slug: 'calm',
    },
    {
      label: '5-4-3-2-1',
      slug: 'grounding',
    },
    {
      label: '일기',
      slug: 'diary',
    },
    {
      label: '학습',
      slug: 'learning',
    },
  ]);

  return (
    <View className="flex-1 bg-green-100 relative">
      <Image
        source={backgroundImage}
        className="absolute bottom-0 w-full h-full"
        contentFit="cover"
      />

      <View className="absolute inset-x-0 bottom-0 items-center justify-end h-[50%] pb-20 pointer-events-none">
        <Image
          source={catDefaultImage}
          className="w-[60%] max-w-[300px] h-full"
          contentFit="contain"
        />
      </View>

      <View
        className="flex-row flex-wrap justify-center items-center gap-1"
        style={{
          paddingTop: insets.top + scale(20),
          paddingHorizontal: scale(5),
        }}
      >
        {data.map((item, index) => (
          <Pressable
            key={index}
            style={{ width: ITEM_SIZE - 10, height: ITEM_SIZE - 10 }}
            className="max-w-[150px] aspect-square bg-neutral-200 border-[3px] border-solid border-blue-200 justify-center items-center rounded-xl"
            onPress={() => {
              router.push(`/(cbt)/${item.slug}` as Href);
            }}
          >
            <Text className="text-body-large">{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <ChatScreen />
    </View>
  );
}
