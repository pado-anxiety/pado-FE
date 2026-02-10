import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, TextInput } from 'react-native';

import { NavButton, Text, View } from '@src/components/ui';
import { showAlert } from '@src/lib/alert';

import { ActStepLayout } from '../../components';
import { MAX_CHAR_LIMIT } from '../constants';
import type { ActionStepMeta, Value } from '../types';
import { ValueCircle } from './ValueCircle';

interface ActionStepContentProps {
  meta: ActionStepMeta;
  stepIndex: number;
  selectedValue: Value;
  selectedDomain: keyof Value;
  lowestDomains: (keyof Value)[];
  orientation: string;
  obstacle: string;
  action: string;
  onSelectValue: (key: keyof Value, value: number) => void;
  onSelectDomain: (domain: keyof Value) => void;
  onOrientationChange: (text: string) => void;
  onObstacleChange: (text: string) => void;
  onActionChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export function ActionStepContent({
  meta,
  stepIndex,
  selectedValue,
  selectedDomain,
  lowestDomains,
  orientation,
  obstacle,
  action,
  onSelectValue,
  onSelectDomain,
  onOrientationChange,
  onObstacleChange,
  onActionChange,
  onNext,
  onBack,
  onClose,
}: ActionStepContentProps) {
  const { t } = useTranslation();
  const i18nKey = meta.i18nKey ?? '';

  const title = t(`${i18nKey}.title`);
  const description = i18nKey ? t(`${i18nKey}.description`) : '';
  const nextButtonText = t('common.button.next');

  const isNextDisabled = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return Object.values(selectedValue).some((v) => v === null);
      case 1:
        return orientation.trim().length === 0;
      case 2:
        return obstacle.trim().length === 0;
      case 3:
        return action.trim().length === 0;
      default:
        return false;
    }
  }, [stepIndex, selectedValue, orientation, obstacle, action]);

  const validateAndNext = useCallback(() => {
    const currentText =
      stepIndex === 1 ? orientation : stepIndex === 2 ? obstacle : action;

    if (stepIndex >= 1 && currentText.length > MAX_CHAR_LIMIT) {
      showAlert.validation(
        t('common.validation.charLimitExceeded'),
        t('common.validation.charLimitMessage', {
          maxLength: MAX_CHAR_LIMIT,
          currentLength: currentText.length,
        }),
      );
      return;
    }

    onNext();
  }, [stepIndex, orientation, obstacle, action, onNext, t]);

  const domainLabel = t(`act.values.domain.${selectedDomain}`);

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
        onButtonClick={validateAndNext}
        buttonDisabled={isNextDisabled}
      >
        {stepIndex === 0 && (
          <ValueCheckContent
            title={title}
            description={description}
            selectedValue={selectedValue}
            onSelectValue={onSelectValue}
          />
        )}
        {stepIndex === 1 && (
          <OrientationContent
            title={title}
            description={description}
            domainLabel={domainLabel}
            lowestDomains={lowestDomains}
            selectedDomain={selectedDomain}
            orientation={orientation}
            onSelectDomain={onSelectDomain}
            onOrientationChange={onOrientationChange}
            placeholder={t('act.values.step.step2.placeholder')}
          />
        )}
        {stepIndex === 2 && (
          <TextInputContent
            title={title}
            description={description}
            value={obstacle}
            onChange={onObstacleChange}
            placeholder={t('act.values.step.step3.placeholder')}
          />
        )}
        {stepIndex === 3 && (
          <TextInputContent
            title={title}
            description={description}
            value={action}
            onChange={onActionChange}
            placeholder={t('act.values.step.step4.placeholder')}
          />
        )}
      </ActStepLayout>
    </Pressable>
  );
}

// Step 1: Value check with circle
function ValueCheckContent({
  title,
  description,
  selectedValue,
  onSelectValue,
}: {
  title: string;
  description: string;
  selectedValue: Value;
  onSelectValue: (key: keyof Value, value: number) => void;
}) {
  return (
    <View className="flex-1 gap-4">
      <View className="gap-2">
        <Text
          preset="heading"
          bold
        >
          {title}
        </Text>
        <Text
          preset="body"
          className="text-sub"
        >
          {description}
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <ValueCircle
          selectedValue={selectedValue}
          onSelectValue={onSelectValue}
        />
      </View>
    </View>
  );
}

// Step 2: Orientation with domain selector
function OrientationContent({
  title,
  description,
  domainLabel,
  lowestDomains,
  selectedDomain,
  orientation,
  onSelectDomain,
  onOrientationChange,
  placeholder,
}: {
  title: string;
  description: string;
  domainLabel: string;
  lowestDomains: (keyof Value)[];
  selectedDomain: keyof Value;
  orientation: string;
  onSelectDomain: (domain: keyof Value) => void;
  onOrientationChange: (text: string) => void;
  placeholder: string;
}) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 gap-4">
      {lowestDomains.length > 1 && (
        <View className="flex-row flex-wrap gap-2">
          {lowestDomains.map((domain) => (
            <Pressable
              key={domain}
              onPress={() => onSelectDomain(domain)}
              className={`rounded-2xl px-4 py-2 ${
                selectedDomain === domain
                  ? 'bg-btn-act-page'
                  : 'bg-blue-100'
              }`}
            >
              <Text
                preset="caption"
                bold
                className={
                  selectedDomain === domain ? 'text-white' : 'text-black'
                }
              >
                {t(`act.values.domain.${domain}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
      <View className="gap-2">
        <View className="flex-row flex-wrap items-center gap-2">
          <View className="rounded-xl bg-btn-act-page px-3 py-1">
            <Text
              preset="heading"
              bold
              className="text-white"
            >
              {domainLabel}
            </Text>
          </View>
          <Text
            preset="heading"
            bold
          >
            {title}
          </Text>
        </View>
        <Text
          preset="body"
          className="text-sub"
        >
          {description}
        </Text>
      </View>
      <TextInput
        value={orientation}
        onChangeText={onOrientationChange}
        placeholder={placeholder}
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
    </View>
  );
}

// Steps 3-4: Simple text input
function TextInputContent({
  title,
  description,
  value,
  onChange,
  placeholder,
}: {
  title: string;
  description: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}) {
  return (
    <View className="flex-1 gap-4">
      <View className="gap-2">
        <Text
          preset="heading"
          bold
        >
          {title}
        </Text>
        <Text
          preset="body"
          className="text-sub"
        >
          {description}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
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
    </View>
  );
}
