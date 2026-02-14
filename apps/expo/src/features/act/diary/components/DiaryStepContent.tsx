import { useCallback, useState } from 'react';

import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, TextInput } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Divider, NavButton, Text, View } from '@src/components/ui';
import { showAlert } from '@src/lib/alert';

import { ActStepLayout } from '../../components';
import { MAX_CHAR_LIMIT, STEP_COUNT } from '../constants';
import type { DiaryStepMeta, HistoryCard } from '../types';

interface DiaryStepContentProps {
  meta: DiaryStepMeta;
  stepIndex: number;
  historyCards: HistoryCard[];
  onNext: (answer: string) => void;
  onBack: () => void;
  onClose: () => void;
}

export function DiaryStepContent({
  meta,
  stepIndex,
  historyCards,
  onNext,
  onBack,
  onClose,
}: DiaryStepContentProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const [answer, setAnswer] = useState('');

  const i18nKey = meta.i18nKey ?? '';
  const question = t(`${i18nKey}.question`);
  const description = t(`${i18nKey}.description`);
  const nextButtonText = t('common.button.next');

  const getPlaceholder = () => {
    if (stepIndex === STEP_COUNT - 1) {
      return t('act.diary.step.placeholder');
    }
    const exampleGood = t(`${i18nKey}.exampleGood`);
    return `${t('common.example')}) ${exampleGood}`;
  };

  const handleNext = useCallback(() => {
    if (!answer.trim()) return;

    if (answer.length > MAX_CHAR_LIMIT) {
      showAlert.validation(
        t('common.validation.charLimitExceeded'),
        t('common.validation.charLimitMessage', {
          maxLength: MAX_CHAR_LIMIT,
          currentLength: answer.length,
        }),
      );
      return;
    }

    onNext(answer);
  }, [answer, onNext, t]);

  // Reset answer when step changes
  const [prevStepIndex, setPrevStepIndex] = useState(stepIndex);
  if (stepIndex !== prevStepIndex) {
    setAnswer('');
    setPrevStepIndex(stepIndex);
  }

  const isNextDisabled = !answer.trim();

  return (
    <Pressable
      className="flex flex-1"
      onPress={Keyboard.dismiss}
    >
      <ActStepLayout
        leftButton={
          <NavButton
            variant="back"
            onPress={onBack}
          />
        }
        rightButton={
          <NavButton
            variant="close"
            onPress={onClose}
          />
        }
        buttonText={nextButtonText}
        onButtonClick={handleNext}
        buttonDisabled={isNextDisabled}
      >
        {/* History cards */}
        {historyCards.length > 0 && (
          <View className="gap-3">
            {historyCards.map((card, index) => (
              <View
                key={`history-${index}`}
                className="border-l-2 border-default pl-4"
              >
                <Text
                  preset="caption"
                  bold
                  className="text-sub"
                >
                  {t(`act.diary.step.step${index + 1}.question`)}
                </Text>
                <Text
                  preset="sub"
                  className="text-sub"
                  numberOfLines={1}
                >
                  {card.answer}
                </Text>
              </View>
            ))}
            <Divider />
          </View>
        )}

        {/* Question section */}
        <View className="gap-2">
          <Text
            preset="heading"
            bold
          >
            {question}
          </Text>
          <Text preset="body">{description}</Text>
        </View>

        {/* Answer input */}
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder={getPlaceholder()}
          placeholderTextColor={tokens['--act-input-placeholder']}
          multiline
          className="flex-1 rounded-2xl border border-white bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
          style={{
            textAlignVertical: 'top',
            fontSize: 17,
            lineHeight: 26,
            fontFamily: 'Pretendard-Regular',
          }}
        />
      </ActStepLayout>
    </Pressable>
  );
}
