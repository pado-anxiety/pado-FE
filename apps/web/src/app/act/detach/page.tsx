'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib/webview';

export default function DetachPage() {
  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  return (
    <PageLayout>
      <div className="flex flex-1 flex-col justify-between items-center">
        <Text>DetachPage</Text>
        <Button
          size="default"
          text="시작하기"
          onClick={handleStart}
        />
      </div>
    </PageLayout>
  );
}
