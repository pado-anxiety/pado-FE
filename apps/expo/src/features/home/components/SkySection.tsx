import { AnimatedText, TouchableOpacity, View } from '@src/components/ui';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export function SkySection({
  setPage,
}: {
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT') => void;
}): React.ReactNode {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex flex-col bg-white items-start justify-center gap-4 px-8"
      style={{
        paddingTop: insets.top + scale(50),
      }}
    >
      <View className="flex flex-col gap-8 w-full">
        <AnimatedText
          delay={1000}
          className="text-2xl font-medium"
        >
          twheo 님 안녕하세요
        </AnimatedText>
        <View className="flex flex-col gap-6 w-full">
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => setPage('HISTORY')}
          >
            <AnimatedText
              delay={1500}
              className="text-4xl text-slate-700 font-medium"
            >
              ACT 기록 보기
            </AnimatedText>
            <Animated.View
              className="w-full h-[1.5px] bg-slate-300 mt-1"
              entering={FadeIn.duration(1500)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col"
            onPress={() => setPage('CHAT')}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl text-slate-700 font-medium"
            >
              바람과 대화하기
            </AnimatedText>
            <Animated.View
              className="w-full h-[1.5px] bg-slate-300 mt-1"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
