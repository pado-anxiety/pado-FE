'use client';

import { Button } from '@pado/ui';

export default function AnchorResultPage() {
  const handleNextStep = () => {
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      const message = JSON.stringify({
        type: 'NAVIGATE_HOME',
      });
      window.ReactNativeWebView.postMessage(message);
      return;
    }

    window.location.href = '/';
  };

  return (
    <div className="flex flex-col flex-1 justify-between items-center bg-green-100">
      <div>
        <h1>Anchor Result</h1>
      </div>
      <Button
        size="default"
        text="다음"
        onClick={handleNextStep}
      />
    </div>
  );
}
