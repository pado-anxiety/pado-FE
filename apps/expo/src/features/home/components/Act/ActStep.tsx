import { useRef } from 'react';

import { Pressable, Text, View } from '@src/components/ui';
import { getActRoute } from '@src/lib/route/route';
import { useRouter } from 'expo-router';

import { BubbleSize, Point } from './ActList';

type ActButtonProps = {
  item: {
    label: string;
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
    <View className="flex-col w-full gap-40">
      <View
        className="flex-1 items-center justify-center px-20 gap-2"
        style={{
          alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
        }}
      >
        <Pressable
          ref={circleRef}
          className="bg-white p-4 rounded-full"
          style={{
            width: BubbleSize,
            height: BubbleSize,
          }}
          onPress={() => {
            router.push(getActRoute(item.slug));
          }}
          onLayout={handleLayout}
        ></Pressable>
        <Text className="text-label-medium bg-white p-2 rounded-lg">
          {item.label}
        </Text>
      </View>
    </View>
  );
}
