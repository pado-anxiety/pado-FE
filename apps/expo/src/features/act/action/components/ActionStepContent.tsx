import { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable } from 'react-native';

import { NavButton } from '@src/components/ui';
import { showAlert } from '@src/lib/alert';

import { ActStepLayout } from '../../components';
import { MAX_CHAR_LIMIT } from '../constants';
import type { ActionStepMeta, Value } from '../types';
import { OrientationContent } from './OrientationContent';
import { TextInputContent } from './TextInputContent';
import { ValueCheckContent } from './ValueCheckContent';

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

  const getTextForStep = useCallback(
    (step: number): string => {
      switch (step) {
        case 1:
          return orientation;
        case 2:
          return obstacle;
        default:
          return action;
      }
    },
    [orientation, obstacle, action],
  );

  const validateAndNext = useCallback(() => {
    const currentText = getTextForStep(stepIndex);

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
  }, [stepIndex, getTextForStep, onNext, t]);

  const domainLabel = t(`act.values.domain.${selectedDomain}`);

  const renderStepContent = () => {
    switch (stepIndex) {
      case 0:
        return (
          <ValueCheckContent
            title={title}
            description={description}
            selectedValue={selectedValue}
            onSelectValue={onSelectValue}
          />
        );
      case 1:
        return (
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
        );
      case 2:
        return (
          <TextInputContent
            title={title}
            description={description}
            value={obstacle}
            onChange={onObstacleChange}
            placeholder={t('act.values.step.step3.placeholder')}
          />
        );
      case 3:
        return (
          <TextInputContent
            title={title}
            description={description}
            value={action}
            onChange={onActionChange}
            placeholder={t('act.values.step.step4.placeholder')}
          />
        );
      default:
        return null;
    }
  };

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
        {renderStepContent()}
      </ActStepLayout>
    </Pressable>
  );
}
