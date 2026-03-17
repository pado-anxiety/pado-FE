import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, View } from '@src/components/ui';
import { useIconColor } from '@src/lib/theme/useIconColor';

import { SITUATION_CHIPS, THOUGHT_CHIPS } from '../../constants';
import { useDiaryWrite } from '../../hooks/useDiaryWrite';
import { useEmotionBottomSheet } from '../EmotionBottomSheet';
import { ProgressDots } from '../ProgressDots';
import { EmotionStep } from './EmotionStep';
import { StepGuide } from './StepGuide';
import { StepPreview } from './StepPreview';
import { TextStep } from './TextStep';
import { WriteHeader } from './WriteHeader';

export function DiaryWriteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { accent } = useIconColor();

  const diary = useDiaryWrite();
  const emotionSheet = useEmotionBottomSheet({
    selectedEmotions: diary.selectedEmotions,
    onToggle: diary.toggleEmotion,
  });

  const { funnel, stepI18nKey } = diary;

  return (
    <Pressable
      className="flex-1 bg-act-page"
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 16,
      }}
      onPress={Keyboard.dismiss}
    >
      <WriteHeader
        onBack={diary.handlePrev}
        onClose={() => router.back()}
      />

      <View className="mt-3 px-6">
        <ProgressDots currentStep={funnel.currentIndex} />
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 16,
          gap: 16,
        }}
      >
        {funnel.currentStep === 'thought' && (
          <StepPreview
            label={t('diary.write.preview.situation')}
            value={funnel.context.situation}
          />
        )}
        {funnel.currentStep === 'emotion' && (
          <StepPreview
            label={t('diary.write.preview.thought')}
            value={funnel.context.thought}
          />
        )}

        <StepGuide
          animationKey={funnel.currentStep}
          badge={t(`${stepI18nKey}.badge`)}
          question={t(`${stepI18nKey}.question`)}
          hint={t(`${stepI18nKey}.hint`)}
          accentColor={accent}
        />

        {funnel.currentStep !== 'emotion' ? (
          <TextStep
            chips={
              funnel.currentStep === 'situation'
                ? SITUATION_CHIPS
                : THOUGHT_CHIPS
            }
            chipsLabel={t(`${stepI18nKey}.chipsLabel`)}
            value={diary.currentText}
            onChange={diary.currentSetter}
            onChipSelect={diary.handleChipSelect}
            placeholder={t(`${stepI18nKey}.placeholder`)}
            inputRef={diary.textInputRef}
          />
        ) : (
          <EmotionStep
            emotions={diary.allEmotions}
            selectedEmotions={diary.selectedEmotions}
            onToggle={diary.toggleEmotion}
            onShowMore={() => emotionSheet.present()}
          />
        )}
      </View>

      <View className="mt-6 px-6">
        <Button
          text={t(`diary.write.button.${funnel.currentStep}`)}
          onPress={diary.handleNext}
          disabled={diary.isNextDisabled}
          className="bg-btn-dark"
        />
      </View>

      {emotionSheet.sheet}
    </Pressable>
  );
}
