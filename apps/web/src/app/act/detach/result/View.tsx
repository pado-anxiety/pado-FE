'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import { ResultDisplay, UserTextToken } from '@/features/detach';
import { handlePostMessage } from '@/lib';

export default function DetachResultView() {
  const data = window.detachResult.data as UserTextToken[] | undefined;

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  if (!data) {
    return (
      <div className="flex flex-1 flex-col justify-between items-center">
        <Text>결과를 불러올 수 없습니다.</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between items-center">
      <ResultDisplay result={data} />
      <Button
        size="default"
        text="다음"
        onClick={handleStart}
        className="bg-btn-act-page"
      />
    </div>
  );
}
