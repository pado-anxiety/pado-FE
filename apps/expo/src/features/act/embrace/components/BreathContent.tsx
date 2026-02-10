import { useTranslation } from 'react-i18next';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';

import { Button, NavButton, Text, View } from '@src/components/ui';

interface BreathContentProps {
  isStarted: boolean;
  isCompleted: boolean;
  breathText: string;
  timer: number;
  onStartClick: () => void;
  onRestart: () => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export function BreathContent({
  isStarted,
  isCompleted,
  breathText,
  timer,
  onStartClick,
  onRestart,
  onNext,
  onBack,
  onClose,
}: BreathContentProps) {
  const { t } = useTranslation();

  return (
    <View className="absolute inset-0 z-20">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ marginTop: 60 }}
      >
        <View style={{ marginLeft: -6 }}>
          <NavButton
            variant="back"
            onPress={onBack}
          />
        </View>
        <NavButton
          variant="close"
          onPress={onClose}
        />
      </View>

      {/* Center content */}
      <View className="flex-1 items-center justify-center px-4">
        {!isStarted ? (
          <Button
            text={t('act.embrace.step.startButton')}
            onPress={onStartClick}
            className="rounded-2xl bg-btn-act-page px-12 py-5 shadow-lg"
          />
        ) : (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="items-center gap-6"
          >
            {/* Breath text */}
            <View className="rounded-2xl bg-white/30 px-6 py-4">
              <Text
                preset="heading"
                className="text-center text-gray-900"
              >
                {breathText}
              </Text>
            </View>

            {/* Timer */}
            {timer > 0 && (
              <Animated.View
                key={timer}
                entering={ZoomIn.duration(200)}
                className="rounded-2xl bg-white/30 px-6 py-4"
              >
                <Text
                  preset="title"
                  bold
                  className="text-blue-900"
                >
                  {timer}
                </Text>
              </Animated.View>
            )}

            {/* Completed buttons */}
            {isCompleted && (
              <Animated.View
                entering={FadeIn.duration(400)}
                className="mt-4 items-center gap-4"
              >
                <Button
                  text={t('act.embrace.step.restartButton')}
                  onPress={onRestart}
                  className="rounded-2xl bg-transparent px-20 py-5"
                  textClassName="text-white underline"
                />
                <Button
                  text={t('common.button.next')}
                  onPress={onNext}
                  className="rounded-2xl bg-btn-act-page px-14 py-4 shadow-lg"
                />
              </Animated.View>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}
