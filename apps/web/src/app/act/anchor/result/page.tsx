'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';

export default function AnchorResultPage() {
  const handleNextStep = () => {
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      const message = JSON.stringify({
        type: WEBVIEW_MESSAGE_TYPE.NAVIGATE,
      });
      window.ReactNativeWebView.postMessage(message);
      return;
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col flex-1 justify-between items-center">
        <div className="flex flex-1 justify-center items-center">
          <Text className="text-title-medium">5-4-3-2-1 결과 및 마무리</Text>
        </div>
        <Button
          size="default"
          text="다음"
          onClick={handleNextStep}
        />
      </div>
    </PageLayout>
  );
}
