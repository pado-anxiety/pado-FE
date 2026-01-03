'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib/webview';

const description = [
  '잃어버린 감정을 되찾기 위해 상황을 되돌아봐요.',
  '그리고 당시 느꼈던 나의 진짜 감정이 무엇이었는지 되짚어봐요.',
];

export default function DiaryPage() {
  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
    });
  };

  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-4">
          <Text className="text-title-medium">마음 일기</Text>
          {description.map((desc) => (
            <Text
              key={desc}
              className="text-body-medium"
            >
              {desc}
            </Text>
          ))}
        </div>
        <Button
          size="default"
          text="시작하기"
          onClick={handleStart}
          className="bg-btn-act-page"
        />
      </div>
    </PageLayout>
  );
}
