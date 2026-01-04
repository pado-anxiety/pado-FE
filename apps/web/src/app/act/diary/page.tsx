'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';
import { X } from 'lucide-react';

// 1단계와 동일하게 닫기 버튼용 아이콘 추가

import { Divide } from '@/components/ui';
import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib/webview';

const description = [
  '불안은 사건 그 자체가 아니라, 그 사건을 바라보는 내 "생각"에서 시작됩니다.',
  '우리는 하루에도 수만 가지 생각을 하지만, 정작 어떤 생각이 내 마음을 흔드는지 모를 때가 많아요.',
  '마치 제3자가 된 것처럼, 당시의 상황과 내 머릿속을 한 걸음 떨어져서 관찰해 볼까요?',
];

export default function DiaryPage() {
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
        {/* 상단 헤더 및 설명 (1단계와 동일 구조) */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center">
            <Text className="text-title-medium">마음 일기</Text>
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

        {/* 컨텐츠 설명 영역 (스크롤 가능) */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Text className="text-body-medium font-bold">
                마음의 흐름을 읽는 3단계
              </Text>
              <Text className="text-body-small text-sub">
                엉켜있는 마음을 상황, 생각, 감정으로 나누어 정리하는 &apos;생각
                분리&apos; 기법입니다.
              </Text>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Text className="text-body-small font-bold text-primary">
                  1. 상황 (Fact)
                </Text>
                <Text className="text-body-small">
                  언제, 어디서, 무슨 일이 있었나요?
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text className="text-body-small font-bold text-primary">
                  2. 생각 (Thought)
                </Text>
                <Text className="text-body-small">
                  그때 머릿속을 스쳐 지나간 생각은 무엇인가요?
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text className="text-body-small font-bold text-primary">
                  3. 감정 (Emotion)
                </Text>
                <Text className="text-body-small">
                  그 생각으로 인해 어떤 감정을 느꼈나요?
                </Text>
              </div>
            </div>

            <div className="mt-2 p-3 bg-white/50 rounded-lg">
              <Text className="text-body-small italic">
                Tip: &apos;생각&apos;은 사실이 아닙니다. 내가 상황을 어떻게
                해석했는지 발견하는 것이 핵심이에요.
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
