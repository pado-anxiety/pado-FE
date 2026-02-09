import { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, TextInput } from 'react-native';

import { NavButton, Text, View } from '@src/components/ui';
import { showAlert } from '@src/lib/alert';

import { ActStepLayout } from '../../components';
import { MAX_CHAR_LIMIT } from '../constants';
import type { DetachStepMeta, UserTextToken } from '../types';
import { TokenSelector } from './TokenSelector';

interface DetachStepContentProps {
  meta: DetachStepMeta;
  stepIndex: number;
  userTextTokens: UserTextToken[];
  onNextStep1: (text: string) => void;
  onNextStep2: () => void;
  onBack: () => void;
  onClose: () => void;
  setUserTextTokens: (tokens: UserTextToken[]) => void;
}

export function DetachStepContent({
  meta,
  stepIndex,
  userTextTokens,
  onNextStep1,
  onNextStep2,
  onBack,
  onClose,
  setUserTextTokens,
}: DetachStepContentProps) {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');

  const i18nKey = meta.i18nKey ?? '';
  const title = t(`${i18nKey}.title`, { returnObjects: true }) as string[];
  const description = t(`${i18nKey}.description`);
  const nextButtonText = t('common.button.next');

  // Reset input when step changes
  const [prevStepIndex, setPrevStepIndex] = useState(stepIndex);
  if (stepIndex !== prevStepIndex) {
    setInputText('');
    setPrevStepIndex(stepIndex);
  }

  const handleNextStep1 = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (trimmed.length > MAX_CHAR_LIMIT) {
      showAlert.validation(
        t('common.validation.charLimitExceeded'),
        t('common.validation.charLimitMessage', {
          maxLength: MAX_CHAR_LIMIT,
          currentLength: trimmed.length,
        }),
      );
      return;
    }

    onNextStep1(trimmed);
  }, [inputText, onNextStep1, t]);

  const handleNextStep2 = useCallback(() => {
    const hasSelection = userTextTokens.some((token) => token.isSelected);
    if (!hasSelection) return;
    onNextStep2();
  }, [userTextTokens, onNextStep2]);

  const isStep1 = stepIndex === 0;
  const isNextDisabled = isStep1
    ? !inputText.trim()
    : !userTextTokens.some((token) => token.isSelected);

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
        onButtonClick={isStep1 ? handleNextStep1 : handleNextStep2}
        buttonDisabled={isNextDisabled}
      >
        {/* Title */}
        <View className="gap-2">
          <Text
            preset="heading"
            bold
          >
            {title.map((line, index) => (
              <Text
                key={index}
                preset="heading"
                bold
              >
                {line}
                {index < title.length - 1 ? '\n' : ''}
              </Text>
            ))}
          </Text>
          <Text preset="body">{description}</Text>
        </View>

        {/* Step 1: Text input */}
        {isStep1 && (
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('act.detach.step.step1.placeholder')}
            placeholderTextColor="#9CA3AF"
            multiline
            className="flex-1 rounded-2xl border border-white bg-white/60 p-4"
            style={{
              textAlignVertical: 'top',
              fontSize: 17,
              lineHeight: 26,
              fontFamily: 'Pretendard-Regular',
            }}
          />
        )}

        {/* Step 2: Token selection */}
        {!isStep1 && (
          <TokenSelector
            userTextTokens={userTextTokens}
            setUserTextTokens={setUserTextTokens}
          />
        )}
      </ActStepLayout>
    </Pressable>
  );
}
