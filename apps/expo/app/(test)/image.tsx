import { useEffect, useState } from 'react';

import { Image, preloadImages } from '@src/components/ui';
import { Text, View } from 'react-native';

import { Button } from '@pado/ui';

const imageUrls = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3',
  'https://picsum.photos/400/400?random=4',
];

export default function ImagePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentImageUrl = imageUrls[currentIdx];

  useEffect(() => {
    preloadImages(imageUrls);
  }, []);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % imageUrls.length);
  };

  const handlePrevious = () => {
    setCurrentIdx((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-page px-4">
      <Text className="text-2xl font-bold text-body">
        {currentIdx + 1} / {imageUrls.length}
      </Text>
      <Image
        source={currentImageUrl}
        className="h-96 w-96 rounded-lg"
        contentFit="cover"
        transition={500}
        placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
      />
      <View className="flex-row gap-2">
        <Button
          text="Previous"
          onPress={handlePrevious}
          color="link"
          size="default"
          disabled={false}
          fullWidth={true}
        />
        <Button
          text="Next"
          onPress={handleNext}
          color="link"
          size="default"
          disabled={false}
          fullWidth={true}
        />
      </View>
    </View>
  );
}
