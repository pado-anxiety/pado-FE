import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { NavButton } from '@/components/ui';
import { handlePostMessage } from '@/lib';
import { useDuration } from '@/lib/analytics/useDuration';

export function EmbraceStepHeader() {
  const { getDuration } = useDuration();

  const handleGoBack = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'BACK',
      step: 0,
      duration: getDuration(),
    });
  const handleGoHome = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
      step: 0,
      duration: getDuration(),
    });

  return (
    <div className="z-20 flex flex-row w-full justify-between px-8">
      <NavButton
        variant="back"
        size="large"
        onClick={handleGoBack}
      />
      <NavButton
        variant="close"
        size="large"
        onClick={handleGoHome}
      />
    </div>
  );
}
