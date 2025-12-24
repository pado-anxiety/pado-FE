import catDefaultImage from '@assets/images/cat/default_shadow.webp';
import backgroundImage from '@assets/images/home/background.webp';
import { Image, View } from '@src/components/ui';

export function HomeBackground(): React.ReactNode {
  return (
    <>
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
    </>
  );
}
