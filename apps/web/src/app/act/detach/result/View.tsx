'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button } from '@pado/ui';

import { ResultDisplay, UserTextToken } from '@/features/detach';
import { handlePostMessage } from '@/lib';

export default function DetachResultView() {
  const data = window.detachResult.data as UserTextToken[];

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  return (
    <div className="flex flex-1 flex-col justify-between items-center">
      <ResultDisplay result={data} />
      <Button
        size="default"
        text="다음"
        onClick={handleStart}
      />
    </div>
  );
}
