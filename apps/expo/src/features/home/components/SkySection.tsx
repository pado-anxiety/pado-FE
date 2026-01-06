import { TouchableOpacity, View } from '@src/components/ui';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export function SkySection(): React.ReactNode {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex flex-col bg-white items-start justify-center gap-4 px-8"
      style={{
        paddingTop: insets.top + scale(50),
      }}
    >
      <View className="flex flex-col gap-8 w-full">
        <Animated.Text
          className="text-2xl font-medium"
          entering={FadeIn.duration(1000)}
          style={{ fontFamily: 'NanumSquareNeo-Variable' }}
        >
          twheo 님 안녕하세요
        </Animated.Text>
        <View className="flex flex-col gap-6 w-full">
          <TouchableOpacity className="flex flex-col">
            <Animated.Text
              entering={FadeIn.duration(1500)}
              className="text-4xl text-slate-700 font-medium"
              style={{ fontFamily: 'NanumSquareNeo-Variable' }}
            >
              ACT 기록 보기
            </Animated.Text>
            <View className="w-full h-[1px] bg-slate-300 mt-1" />
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-col">
            <Animated.Text
              entering={FadeIn.duration(2000)}
              className="text-4xl text-slate-700 font-medium"
              style={{ fontFamily: 'NanumSquareNeo-Variable' }}
            >
              바람과 대화하기
            </Animated.Text>
            <View className="w-full h-[1px] bg-slate-300 mt-1" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
