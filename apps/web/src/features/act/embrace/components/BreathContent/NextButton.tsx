import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button } from '@pado/ui';

import { handlePostMessage } from '@/lib';

import { TIME_CALCULATION } from '../../constants';

type NextButtonProps = {
  sessionCount: number;
  getDuration: () => number;
};

export function NextButton({ sessionCount, getDuration }: NextButtonProps) {
  const { t } = useTranslation();

  const calculateTotalTime = () => {
    const secondsPerSession = TIME_CALCULATION.getSecondsPerSession();
    const totalSeconds = secondsPerSession * sessionCount;
    return totalSeconds;
  };

  const handleClick = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
      step: 0,
      duration: getDuration(),
    });
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
      data: { embraceResult: calculateTotalTime() },
    });
  };

  return (
    <Button
      text={t('common.button.next')}
      size="default"
      fullWidth={false}
      className="bg-btn-act-page text-body-medium px-14 py-4 rounded-2xl shadow-lg"
      onClick={handleClick}
    />
  );
}
