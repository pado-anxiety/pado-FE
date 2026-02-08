import { useEffect } from 'react';

import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RADIUS = 42;
const STROKE_WIDTH = 7;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ProgressCircleProps {
  /** 0~1 사이 진행률 */
  progress: number;
  size: number;
}

export function ProgressCircle({ progress, size }: ProgressCircleProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - animatedProgress.value),
  }));

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      {/* Background circle */}
      <Circle
        r={RADIUS}
        cx="50"
        cy="50"
        fill="none"
        stroke="#769BC4"
        opacity={0.4}
        strokeWidth={STROKE_WIDTH}
      />
      {/* Progress circle */}
      <AnimatedCircle
        r={RADIUS}
        cx="50"
        cy="50"
        fill="none"
        stroke="#21344E"
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={CIRCUMFERENCE}
        animatedProps={animatedProps}
        transform="rotate(-90 50 50)"
        strokeLinecap="round"
      />
    </Svg>
  );
}
