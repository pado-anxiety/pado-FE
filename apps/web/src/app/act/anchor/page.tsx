'use client';

import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';

const description = [
  '불안을 받아들이기 전에 마음을 진정시켜볼까요?',
  '불안한 마음을 해결하려애쓰기 전에, 잠시 멈춰서 숨을 고를 필요가 있어요.',
  '복잡한 머릿속 생각의 전원을 끄고, 지금 이 순간의 감각만 느껴보세요.',
];

export default function AnchorPage() {
  const handleStart = () => {
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      const message = JSON.stringify({
        type: 'NAVIGATE_STEP',
      });
      window.ReactNativeWebView.postMessage(message);
      return;
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-4">
          <Text className="text-title-medium">현재에 집중하기</Text>
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
        />
      </div>
    </PageLayout>
  );
}
