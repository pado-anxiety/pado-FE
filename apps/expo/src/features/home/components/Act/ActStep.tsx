import { useRef } from 'react';

import actionImage from '@assets/images/home/action.png';
import anchorImage from '@assets/images/home/anchor.png';
import detachImage from '@assets/images/home/detach.png';
import diaryImage from '@assets/images/home/diary.png';
import embraceImage from '@assets/images/home/embrace.png';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Image, Pressable, Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';
import { getActRoute } from '@src/lib/route/route';

import { BubbleSize, Point } from './types';

const items = ['anchor', 'diary', 'detach', 'embrace', 'action'];

const itemImages = {
  anchor: anchorImage,
  diary: diaryImage,
  detach: detachImage,
  embrace: embraceImage,
  action: actionImage,
};

type ActButtonProps = {
  item: {
    i18nKey: string;
    slug: string;
  };
  index: number;
  containerRef: React.RefObject<View | null>;
  onReportLayout: (point: Point) => void;
};

export function ActStep({
  item,
  index,
  containerRef,
  onReportLayout,
}: ActButtonProps): React.ReactNode {
  const { t } = useTranslation();
  const circleRef = useRef<View>(null);
  const router = useRouter();

  const handleLayout = () => {
    if (circleRef.current && containerRef.current) {
      circleRef.current.measureLayout(
        containerRef.current,
        (left, top, width, height) => {
          const centerX = left + width / 2;
          const centerY = top + height / 2;
          onReportLayout({ x: centerX, y: centerY });
        },
        () => console.error('Layout measurement failed'),
      );
    }
  };

  return (
    <View className="w-full flex-col gap-40">
      <View
        className="flex-1 items-center justify-center gap-2 px-14"
        style={{
          alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
        }}
      >
        <Pressable
          className="relative flex-1 items-center justify-center gap-2"
          onPress={() => {
            triggerHaptic('NAVIGATE');
            router.push(getActRoute(item.slug));
          }}
          onLayout={handleLayout}
        >
          <View className="relative items-center justify-center">
            <View
              ref={circleRef}
              className="rounded-full bg-white p-4"
              style={{
                width: BubbleSize,
                height: BubbleSize,
              }}
            />
            <Image
              className="absolute"
              source={itemImages[items[index] as keyof typeof itemImages]}
              style={{
                width: BubbleSize * 0.8,
                height: BubbleSize * 0.8,
              }}
            />
          </View>
          <Text className="rounded-lg bg-white p-2 text-label-medium">
            {t(item.i18nKey)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
