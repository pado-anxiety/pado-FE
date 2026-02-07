import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { Button } from '@/components/ui/Button';

import { Value } from '../../hooks/useActionStep';
import { TextInputStep } from '../TextInputStep';

type OrientationStepProps = {
  selectedDomain: keyof Value;
  lowestDomains: (keyof Value)[];
  orientation: string;
  onSelectDomain: (domain: keyof Value) => void;
  onOrientationChange: (text: string) => void;
};

export function OrientationStep({
  selectedDomain,
  lowestDomains,
  orientation,
  onSelectDomain,
  onOrientationChange,
}: OrientationStepProps) {
  const { t } = useTranslation();

  const domainLabel = t(`act.values.domain.${selectedDomain}`);

  return (
    <div className="flex flex-1 flex-col gap-4">
      {lowestDomains.length > 1 && (
        <div className="flex flex-row gap-2 flex-wrap">
          {lowestDomains.map((domain) => (
            <Button
              key={domain}
              onClick={() => onSelectDomain(domain)}
              fullWidth={false}
              className={`py-2 px-4 rounded-2xl ${
                selectedDomain !== domain
                  ? 'bg-blue-100 text-black'
                  : 'bg-btn-act-page text-white font-semibold'
              }`}
            >
              <Text className="text-body-small">
                {t(`act.values.domain.${domain}`)}
              </Text>
            </Button>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2 flex-wrap">
          <Text className="text-body-large font-semibold">
            <Text
              as="span"
              className="text-body-large bg-btn-act-page text-white font-semibold py-1 px-3 rounded-xl"
            >
              {domainLabel}
            </Text>
            {t('act.values.step.step2.title')}
          </Text>
        </div>
        <Text className="text-body-medium text-gray-600">
          {t('act.values.step.step2.description')}
        </Text>
      </div>
      <TextInputStep
        value={orientation}
        onChange={onOrientationChange}
        placeholder={t('act.values.step.step2.placeholder')}
      />
    </div>
  );
}
