import { useRef } from 'react';

import { useRouter } from 'expo-router';

import { Pressable, Text, View } from '@src/components/ui';
import { getActRoute } from '@src/lib/route/route';

import { BubbleSize, Point } from './types';

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
    <View className="w-full flex-col gap-40">
      <View
        className="flex-1 items-center justify-center gap-2 px-20"
        style={{
          alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
        }}
      >
        <Pressable
          className="flex-1 items-center justify-center gap-2"
          onPress={() => {
            router.push(getActRoute(item.slug));
          }}
          onLayout={handleLayout}
        >
          <View
            ref={circleRef}
            className="rounded-full bg-white p-4"
            style={{
              width: BubbleSize,
              height: BubbleSize,
            }}
          />
          <Text className="rounded-lg bg-white p-2 text-label-medium">
            {item.label}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
