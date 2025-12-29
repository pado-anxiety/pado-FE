'use client';

import { Button, Text } from '@pado/ui';

export default function AnchorResultPage() {
  const handleNextStep = () => {
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      const message = JSON.stringify({
        type: 'NAVIGATE_HOME',
      });
      window.ReactNativeWebView.postMessage(message);
      return;
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-between items-center bg-green-100">
      <div className="flex flex-1 justify-center items-center">
        <Text className="text-title-medium">5-4-3-2-1 결과 및 마무리</Text>
      </div>
      <Button
        size="default"
        text="다음"
        onClick={handleNextStep}
      />
    </div>
  );
}
