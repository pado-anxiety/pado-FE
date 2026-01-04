'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button } from '@pado/ui';

import { ResultDisplay } from '@/features/act/detach';
import { handlePostMessage } from '@/lib';

export default function DetachResultView() {
  const data = window.detachResult;

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <div className="flex flex-1 flex-col justify-between items-center overflow-y-auto scrollbar-hide gap-4">
      <ResultDisplay result={data || []} />
      <Button
        size="default"
        text="다음"
        onClick={handleStart}
        className="bg-btn-act-page"
      />
    </div>
  );
}
