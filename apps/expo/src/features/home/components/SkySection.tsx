import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { AnimatedText, TouchableOpacity, View } from '@src/components/ui';
import { ROUTES } from '@src/lib/route';

export function SkySection({
  setPage,
}: {
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT') => void;
}): React.ReactNode {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex flex-col items-start justify-center gap-4 bg-white px-8"
      style={{
        paddingTop: insets.top + scale(50),
      }}
    >
      <View className="flex w-full flex-col gap-8">
        <AnimatedText
          delay={1000}
          className="text-2xl font-medium"
        >
          twheo 님 안녕하세요
        </AnimatedText>
        <View className="flex w-full flex-col gap-6">
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => setPage('HISTORY')}
          >
            <AnimatedText
              delay={1500}
              className="text-4xl font-medium text-slate-700"
            >
              ACT 기록 보기
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(1500)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col"
            onPress={() => setPage('CHAT')}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              바람과 대화하기
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => router.push(ROUTES.ONBOARD)}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              온보딩
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => router.push(ROUTES.LOGIN)}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              로그인
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
