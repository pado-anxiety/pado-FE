import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';

import type { ActResultData } from '../types';

interface ActResultContentProps extends ActResultData {
  onComplete: () => void;
  children?: React.ReactNode;
}

export function ActResultContent({
  title,
  description,
  buttonText,
  onComplete,
  children,
}: ActResultContentProps) {
  const insets = useSafeAreaInsets();

  const handleComplete = () => {
    triggerHaptic('NAVIGATE');
    onComplete();
  };

  return (
    <View
      className="flex-1 bg-act-page px-5 pt-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          {/* Title */}
          <Text
            size="title-medium"
            weight="bold"
          >
            {title}
          </Text>

          {/* Description with fade-in animation */}
          <View className="gap-4">
            {description.map((line, index) => (
              <Text
                key={`result-${index}`}
                size="body-medium"
                weight="regular"
              >
                {line}
              </Text>
              // <FadeInText
              //   key={`result-${index}`}
              //   delay={index * ACT_ANIMATION.TEXT_DELAY}
              // >
              //   {line}
              // </FadeInText>
            ))}
          </View>

          {/* Custom content slot */}
          {children}
        </View>
      </ScrollView>

      {/* Bottom button */}
      <Button
        text={buttonText}
        onPress={handleComplete}
        className="bg-btn-act-page"
      />
    </View>
  );
}

// function FadeInText({ children, delay }: { children: string; delay: number }) {
//   const opacity = useSharedValue(0);

//   useEffect(() => {
//     opacity.value = withDelay(
//       delay,
//       withTiming(1, { duration: ACT_ANIMATION.FADE_IN }),
//     );
//   }, [delay, opacity]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//   }));

//   return (
//     <Animated.View style={animatedStyle}>
//       <Text
//         size="body-medium"
//         weight="regular"
//       >
//         {children}
//       </Text>
//     </Animated.View>
//   );
// }
