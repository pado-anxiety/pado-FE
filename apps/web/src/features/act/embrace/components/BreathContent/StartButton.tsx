import { useTranslation } from 'react-i18next';

import { Button, Text } from '@pado/ui';

type StartButtonProps = {
  onClick: () => void;
};

export function StartButton({ onClick }: StartButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      text={t('act.embrace.step.startButton')}
      size="default"
      fullWidth={false}
      className="bg-btn-act-page px-12 py-5 rounded-2xl shadow-lg"
      onClick={onClick}
    >
      <Text className="text-body-medium text-white font-bold">
        {t('act.embrace.step.startButton')}
      </Text>
    </Button>
  );
}
