import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

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
            fullWidth={false}
            className="rounded-2xl bg-btn-act-page px-8 py-4"
          />
        ) : (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={undefined}
            className="items-center"
          >
            {/* Breath text — breathText가 있을 때만 표시 */}
            {breathText !== '' && !isCompleted && (
              <Text
                preset="heading"
                className="rounded-2xl bg-black/50 px-4 py-3 text-center text-white"
              >
                {breathText}
              </Text>
            )}

            {/* Timer */}
            {timer > 0 && (
              <Text
                preset="heading"
                bold
                className="mt-6 rounded-2xl bg-black/50 px-4 py-3 text-white"
              >
                {timer}
              </Text>
            )}

            {/* Completed buttons */}
            {isCompleted && (
              <Animated.View
                entering={FadeIn.duration(400)}
                className="mt-4 items-center gap-4"
              >
                <Button
                  text={t('common.button.next')}
                  onPress={onNext}
                  fullWidth={false}
                  className="rounded-2xl bg-btn-act-page px-12 py-4"
                />
                <Button
                  text={t('act.embrace.step.restartButton')}
                  onPress={onRestart}
                  className="rounded-2xl bg-transparent px-20 py-5"
                  textClassName="text-white underline"
                />
              </Animated.View>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}
