import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button } from '@pado/ui';

import { handlePostMessage } from '@/lib';

import { TIME_CALCULATION } from '../../constants';

type NextButtonProps = {
  sessionCount: number;
};

export function NextButton({ sessionCount }: NextButtonProps) {
  const calculateTotalTime = () => {
    const secondsPerSession = TIME_CALCULATION.getSecondsPerSession();
    const totalSeconds = secondsPerSession * sessionCount;
    return totalSeconds;
  };

  const handleClick = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
      data: { embraceResult: calculateTotalTime() },
    });

  return (
    <Button
      text="다음"
      size="default"
      fullWidth={false}
      className="bg-btn-act-page text-xl px-14 py-4 rounded-2xl shadow-lg"
      onClick={handleClick}
    />
  );
}
