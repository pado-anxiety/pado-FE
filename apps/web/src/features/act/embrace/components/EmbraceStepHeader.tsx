import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button } from '@pado/ui';
import { ArrowLeft, X } from 'lucide-react';

import { handlePostMessage } from '@/lib';

export function EmbraceStepHeader() {
  const handleGoBack = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, { action: 'BACK' });
  const handleGoHome = () =>
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, { action: 'HOME' });

  return (
    <div className="z-20 flex flex-row w-full justify-between px-8">
      <Button
        size="sm"
        color="link"
        onClick={handleGoBack}
      >
        <ArrowLeft
          size={30}
          color="black"
        />
      </Button>
      <Button
        size="sm"
        color="link"
        onClick={handleGoHome}
      >
        <X
          size={30}
          color="black"
        />
      </Button>
    </div>
  );
}
