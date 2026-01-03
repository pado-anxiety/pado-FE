'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib/webview';

const description = [
  '당신의 생각은 사실이 아닙니다. 그저 상상으로 만들어낸 소음일 뿐이에요.',
  '생각에서 한발짝 물러나 볼까요? 붙잡지 말고, 그냥 스쳐 지나가게 두세요.',
];

export default function DetachPage() {
  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-4">
          <Text className="text-title-medium">생각 거리 두기</Text>
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
