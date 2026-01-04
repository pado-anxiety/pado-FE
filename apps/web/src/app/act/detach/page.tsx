'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';
import { X } from 'lucide-react';

import { Divide } from '@/components/ui';
import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib/webview';

const description = [
  '당신의 생각은 사실이 아닙니다. 그저 마음이 만들어낸 소음일 뿐이에요.',
  '생각에서 한 걸음 물러나 볼까요? 꽉 붙잡지 말고, 그저 스쳐 지나가게 두는 연습을 할 거예요.',
  '불안이라는 가짜 알람의 소리를 줄이고, 진짜 현실을 마주하러 가볼까요?',
];

export default function DefusionPage() {
  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
    });
  };

  const handleClose = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-col flex-1 justify-between gap-4">
        {/* 상단 헤더 및 설명 */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center">
            <Text className="text-title-medium">생각 거리두기</Text>
            <Button
              size="sm"
              color="link"
              onClick={handleClose}
              className="p-0"
            >
              <X
                size={30}
                color="black"
              />
            </Button>
          </div>
          {description.map((desc) => (
            <Text
              key={desc}
              className="text-body-small"
            >
              {desc}
            </Text>
          ))}
        </div>

        <Divide />

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Text className="text-body-medium font-bold">
                생각의 힘을 빼는 과정
              </Text>
              <Text className="text-body-small text-sub">
                생각을 현실로 착각하지 않고, 단순히 스쳐 지나가는
                &apos;단어&apos;로 인식하는 연습입니다.
              </Text>
            </div>

            <div className="flex flex-col gap-2">
              <Text className="text-body-small">
                1. 문장 적기: 나를 불안하게 만드는 생각들을 문장으로 적어봅니다.
              </Text>
              <Text className="text-body-small">
                2. 생각 분리하기: 문장에서 사실이 아닌 &apos;나의 생각&apos;
                부분을 직접 드래그하여 선택합니다.
              </Text>
              <Text className="text-body-small">
                3. 흘려보내기: 선택한 생각이 투명해지며 사라지고, 객관적인
                사실만 남는 것을 확인합니다.
              </Text>
            </div>

            <div className="mt-4 p-4 bg-white/50 rounded-xl border border-white">
              <Text className="text-body-small italic">
                Tip: 생각은 뇌가 보내는 &apos;가짜 알람&apos;과 같아요. 소리에
                반응하지 말고, 그저 소리가 들린다는 사실만 알아차려 보세요.
              </Text>
            </div>
          </div>
        </div>

        <Button
          size="default"
          text="거리두기 시작하기"
          onClick={handleStart}
          className="bg-btn-act-page"
        />
      </div>
    </PageLayout>
  );
}
