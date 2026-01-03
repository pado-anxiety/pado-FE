'use client';

import { useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';
import { cn } from 'tailwind-variants';

import { Divide } from '@/components/ui';
import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib';

export default function AnchorResultPage() {
  const [selectedAnswer, setSelectedAnswer] = useState<1 | 2 | 3 | null>(null);

  const handleSelectAnswer = (answer: 1 | 2 | 3) => {
    setSelectedAnswer(answer);
  };

  const handleComplete = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-col flex-1 justify-between items-center">
        <div className="flex flex-1 flex-col justify-center items-start gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Text className="text-title-medium">무사히 닻을 내렸습니다</Text>
            <Text className="text-body-medium font-normal">
              5-4-3-2-1 감각 관찰을 완료했어요.
            </Text>
            <Divide />
          </div>
          <div className="flex flex-col gap-2">
            <Text className="text-body-medium font-normal">
              지금, 당신을 둘러싼 세상이 이전보다 조금 더 선명하게 느껴지시나요?
            </Text>
            <div className="flex flex-col gap-4 w-full">
              <Button
                text="네, 훨씬 선명해졌어요"
                className={cn(
                  'bg-btn-act-page-unselected',
                  selectedAnswer === 1 && 'bg-btn-act-page-selected',
                )}
                onClick={() => handleSelectAnswer(1)}
              />
              <Button
                text="조금은 느껴지는 것 같아요"
                className={cn(
                  'bg-btn-act-page-unselected',
                  selectedAnswer === 2 && 'bg-btn-act-page-selected',
                )}
                onClick={() => handleSelectAnswer(2)}
              />
              <Button
                text="아직은 머릿속이 복잡해요"
                className={cn(
                  'bg-btn-act-page-unselected',
                  selectedAnswer === 3 && 'bg-btn-act-page-selected',
                )}
                onClick={() => handleSelectAnswer(3)}
              />
            </div>
          </div>
        </div>
        <Button
          size="default"
          text="완료"
          onClick={handleComplete}
          className="bg-btn-act-page"
          disabled={selectedAnswer === null}
        />
      </div>
    </PageLayout>
  );
}
