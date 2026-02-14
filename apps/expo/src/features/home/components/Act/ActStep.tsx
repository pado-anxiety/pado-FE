import { useRef } from 'react';

import actionImage from '@assets/images/home/action.png';
import anchorImage from '@assets/images/home/anchor.png';
import detachImage from '@assets/images/home/detach.png';
import diaryImage from '@assets/images/home/diary.png';
import embraceImage from '@assets/images/home/embrace.png';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

import { Image, Pressable, Text, View } from '@src/components/ui';
import { useAnalytics } from '@src/lib/analytics';
import { triggerHaptic } from '@src/lib/haptics';
import { getActRoute } from '@src/lib/route/route';
import { getOceanColors } from '@src/lib/theme';

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
  const { trackContent } = useAnalytics();
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const ocean = getOceanColors(scheme);

  // frontWave → deep 그래디언트를 각 원 깊이에 맞춰 보간한 값
  const STEP_CIRCLE_COLORS =
    scheme === 'dark'
      ? // dark: #162A58 → #0A1430
        ['#152753', '#12234C', '#101F44', '#0E1B3C', '#0B1735']
      : // light: #1E3D72 → #040B1A
        ['#1B3767', '#162E58', '#112446', '#0C1A34', '#071125'];

  const { t } = useTranslation();
  const circleRef = useRef<View>(null);
  const router = useRouter();

  const handlePress = () => {
    triggerHaptic('NAVIGATE');
    trackContent(item.slug);
    router.push(getActRoute(item.slug));
  };

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
      opacity: 0.3,
      border: 1.2,
      color: ocean.horizon,
    },
    {
      scale: 1.6,
      opacity: 0.15,
      border: 1,
      color: ocean.midWave,
    },
    {
      scale: 2.1,
      opacity: 0.06,
      border: 0.8,
      color: ocean.foreWave,
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
          onPress={handlePress}
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
                backgroundColor: STEP_CIRCLE_COLORS[index],
                borderWidth: 1.5,
                borderColor: 'rgba(255, 255, 255, 0.5)',
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

          <View className="mt-4 rounded-3xl bg-surface px-4 py-1.5">
            <Text
              preset="body"
              bold
              className="text-center"
            >
              {t(item.i18nKey)}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
