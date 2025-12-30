'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib';

export default function AnchorResultPage() {
  const handleComplete = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  return (
    <PageLayout>
      <div className="flex flex-col flex-1 justify-between items-center">
        <div className="flex flex-1 justify-center items-center">
          <Text className="text-title-medium">5-4-3-2-1 결과 및 마무리</Text>
        </div>
        <Button
          size="default"
          text="완료"
          onClick={handleComplete}
        />
      </div>
    </PageLayout>
  );
}
