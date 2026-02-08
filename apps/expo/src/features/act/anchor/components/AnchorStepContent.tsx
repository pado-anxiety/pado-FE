import { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';

import { NavButton, Text, View } from '@src/components/ui';

import { ActStepLayout } from '../../components';
import type { AnchorStepMeta } from '../types';
import { CountButtons } from './CountButtons';
import { ProgressCircle } from './ProgressCircle';

interface AnchorStepContentProps {
  meta: AnchorStepMeta;
  stepIndex: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export function AnchorStepContent({
  meta,
  stepIndex,
  onNext,
  onBack,
  onClose,
}: AnchorStepContentProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const circleSize = width * 0.9;

  const count = meta.count ?? 0;
  const i18nKey = meta.i18nKey ?? '';

  const [selectedIndex, setSelectedIndex] = useState(0);

  const progress = count > 0 ? selectedIndex / count : 0;
  const isNextDisabled = selectedIndex !== count;

  const subject = t(`${i18nKey}.subject`);
  const description = t(`${i18nKey}.description`, {
    returnObjects: true,
  }) as string[];
  const example = t(`${i18nKey}.example`);
  const hint = t('act.anchor.step.hint');
  const nextButtonText = t('common.button.next');

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // Reset selectedIndex when step changes
  const [prevStepIndex, setPrevStepIndex] = useState(stepIndex);
  if (stepIndex !== prevStepIndex) {
    setSelectedIndex(0);
    setPrevStepIndex(stepIndex);
  }

  return (
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
      onButtonClick={onNext}
      buttonDisabled={isNextDisabled}
    >
      {/* Circle + text overlay */}
      <View className="flex-1 items-center justify-center">
        <View className="items-center justify-center">
          <ProgressCircle
            progress={progress}
            size={circleSize}
          />

          {/* Centered text overlay */}
          <View
            className="absolute items-center justify-center"
            style={{ width: circleSize, height: circleSize }}
          >
            <Text
              preset="title"
              className="rounded-lg bg-act-page p-2"
            >
              {subject}
            </Text>
            <View className="items-center">
              {description.map((desc) => (
                <Text
                  key={desc}
                  preset="body"
                >
                  {desc}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Example text */}
        <View className="mt-5 items-center gap-3">
          <Text
            preset="sub"
            className="text-sub"
          >
            {stepIndex === 0 ? `${t('common.example')}) ` : ''}
            {example}
          </Text>
        </View>

        {/* Count buttons + hint */}
        <View className="mt-8 w-full items-center gap-4">
          <CountButtons
            count={count}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
          <Text
            preset="caption"
            className="text-sub"
          >
            {hint}
          </Text>
        </View>
      </View>
    </ActStepLayout>
  );
}
