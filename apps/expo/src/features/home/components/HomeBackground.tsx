import catDefaultImage from '@assets/images/cat/default_shadow.webp';
import backgroundImage from '@assets/images/home/background.webp';

import { Image, View } from '@src/components/ui';

export function HomeBackground(): React.ReactNode {
  return (
    <>
      <Image
        source={backgroundImage}
        className="absolute bottom-0 h-full w-full"
        contentFit="cover"
      />

      <View className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] items-center justify-end pb-20">
        <Image
          source={catDefaultImage}
          className="h-full w-[60%] max-w-[300px]"
          contentFit="contain"
        />
      </View>
    </>
  );
}
