import { useTranslation } from 'react-i18next';

import { Button, Text } from '@pado/ui';

type RestartButtonProps = {
  onClick: () => void;
};

export function RestartButton({ onClick }: RestartButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      text={t('act.embrace.step.restartButton')}
      size="default"
      color="primary"
      fullWidth={false}
      className="px-20 py-5 rounded-2xl shadow-lg bg-transparent"
      onClick={onClick}
    >
      <Text className="text-body-small font-bold text-white underline">
        {t('act.embrace.step.restartButton')}
      </Text>
    </Button>
  );
}
