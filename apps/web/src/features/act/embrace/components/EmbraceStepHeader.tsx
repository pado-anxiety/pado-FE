import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { NavButton } from '@/components/ui';
import { handlePostMessage } from '@/lib';

export function EmbraceStepHeader() {
  const handleGoBack = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'BACK',
      step: 0,
    });
  const handleGoHome = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
      step: 0,
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
