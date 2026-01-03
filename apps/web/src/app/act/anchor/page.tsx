'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';
import { X } from 'lucide-react';

import { Divide } from '@/components/ui';
import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib';

const description = [
  '불안의 파도가 몰아칠 때, 가장 먼저 해야 할 일은 "지금, 여기" 에 닻을 내리는 것입니다.',
  '불안을 흘려보내기 전에, 잠시 멈춰 서서 숨을 고를 필요가 있어요.',
  '복잡한 생각의 전원을 잠시 끄고, 오직 지금 이 순간 내 몸과 주변이 보내는 감각에만 집중해 보세요.',
  '이 과정은 불안을 안전하게 흘려보내기 위한 가장 단단한 기초가 됩니다.',
];

export default function AnchorPage() {
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center ">
            <Text className="text-title-medium">현재에 집중하기</Text>
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
                5-4-3-2-1 감각 관찰법
              </Text>
              <Text className="text-body-small text-sub">
                오감을 활용해 마음의 닻을 내리는 접지(grounding) 기법입니다.
              </Text>
            </div>

            <div className="flex flex-col gap-2">
              <Text className="text-body-small">
                1. 눈에 보이는 것 5가지 찾기
              </Text>
              <Text className="text-body-small">
                2. 만질 수 있는 4가지 느끼기
              </Text>
              <Text className="text-body-small">
                3. 귀에 들리는 소리 3가지 집중하기
              </Text>
              <Text className="text-body-small">
                4. 코로 맡아지는 냄새 2가지 찾기
              </Text>
              <Text className="text-body-small">
                5. 입에서 느껴지는 맛 1가지 느끼기
              </Text>
            </div>

            <div className="mt-2 p-3 bg-white/50 rounded-lg">
              <Text className="text-body-small italic">
                Tip: 판단하지 않고, 있는 그대로의 감각에만 천천히 집중해 보세요.
              </Text>
            </div>
          </div>
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
