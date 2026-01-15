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

const STEP_CIRCLE_COLORS = {
  anchor: '#002E5B',
  diary: '#00254A',
  detach: '#012245',
  embrace: '#011731',
  action: '#010C1F',
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

  const ripples = [
    {
      scale: 1.25,
      opacity: 0.4,
      border: 1.2,
      color: '#CBD5E1',
    },
    {
      scale: 1.6,
      opacity: 0.2,
      border: 1,
      color: '#94A3B8',
    },
    {
      scale: 2.1,
      opacity: 0.08,
      border: 0.8,
      color: '#64748B',
    },
  ];

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
            {/* 파동(Ripples) 레이어 */}
            {ripples.map((ripple, i) => (
              <View
                key={i}
                className="absolute rounded-full"
                style={{
                  width: BubbleSize * ripple.scale,
                  height: BubbleSize * ripple.scale,
                  borderWidth: ripple.border,
                  borderColor: 'white',
                  opacity: ripple.opacity,
                }}
              />
            ))}

            <View
              ref={circleRef}
              className="items-center justify-center rounded-full shadow-2xl"
              style={{
                width: BubbleSize,
                height: BubbleSize,
                backgroundColor:
                  STEP_CIRCLE_COLORS[
                    items[index] as keyof typeof STEP_CIRCLE_COLORS
                  ],
                borderWidth: 1.5,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Image
                source={itemImages[items[index] as keyof typeof itemImages]}
                style={{
                  width: BubbleSize * 0.8,
                  height: BubbleSize * 0.8,
                }}
                contentFit="contain"
              />
            </View>
          </View>

          <View className="border-white/2 mt-4 rounded-3xl bg-[#F3F4F6] px-4 py-1.5">
            <Text className="text-label-medium font-bold">
              {t(item.i18nKey)}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
