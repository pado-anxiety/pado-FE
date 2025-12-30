'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib';

export default function DiaryResultPage() {
  const handleNextStep = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  return (
    <PageLayout>
      <div className="flex flex-col flex-1 justify-between items-center">
        <div className="flex flex-1 justify-center items-center">
          <Text className="text-title-medium">마음 일기 결과</Text>
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
