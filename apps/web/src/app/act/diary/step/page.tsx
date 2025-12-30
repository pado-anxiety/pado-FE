'use client';

import { useRef, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib';

const DIARY_STEPS = [
  {
    id: 1,
    question: '어떤 상황이 있었나요?',
    description: '감정이 흔들렸던 순간의 사실을 객관적으로 작성해보세요.',
    example: {
      bad: '팀장님이 무례하게 굴어서 기분이 안좋았다. (X)',
      good: '팀장님이 내 보고서를 던졌다. (O)',
    },
  },
  {
    id: 2,
    question: '그 상황에서 어떤 생각이 스쳤나요?',
    description:
      '그 상황에서 내 머리속을 스쳐 지나간 생각들을 그대로 적습니다. 판단하지 않고 그대로 적어보세요.',
    example: {
      bad: '그냥 팀장님이 무례하게 굴어서 기분이 안좋았다. (X)',
      good: '그냥 팀장님이 무례하게 굴었다고 생각했다. (O)',
    },
  },
  {
    id: 3,
    question: '그 생각 때문에 어떤 느낌이 들었나요?',
    description: "내 몸과 마음에서 어떤 '느낌'이 들었는지 적어봅니다.",
    example: {
      bad: '태그',
      good: '태그',
    },
  },
];

type HistoryCard = {
  question: string;
  answer: string;
};

const stepCount = 3;

export default function DiaryStepPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = DIARY_STEPS[stepIndex];

  const [historyCard, setHistoryCard] = useState<HistoryCard[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <PageLayout>
      <div className="flex flex-col flex-1 gap-3">
        <div className="flex flex-row gap-2 items-center justify-between">
          <Button
            size="default"
            text="나가기"
            onClick={() => console.log('이전')}
          />
          <div className="flex flex-row gap-2">
            {Array.from({ length: stepCount }).map((_, index) => (
              <div
                key={index}
                className="text-center p-2 rounded-lg bg-primary text-white"
                style={{
                  backgroundColor:
                    index === stepIndex
                      ? 'var(--bg-primary)'
                      : 'var(--bg-secondary)',
                }}
              >
                icon: {index + 1}
              </div>
            ))}
          </div>
          <Button
            size="default"
            text="다음"
            onClick={() => {
              if (stepIndex === stepCount - 1) {
                handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
                return;
              }

              if (!textareaRef.current?.value) {
                return;
              }

              setStepIndex(stepIndex + 1);
              setHistoryCard([
                ...historyCard,
                {
                  question: step.question,
                  answer: textareaRef.current.value || '',
                },
              ]);
              textareaRef.current.value = '';
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {historyCard.map((card) => (
            <div
              key={card.question + card.answer}
              className="flex flex-col bg-blue-100 p-4 rounded-lg"
            >
              <Text className="text-body-small">{card.question}</Text>
              <Text className="text-body-small">{card.answer}</Text>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 bg-red-100">
          <div>
            <Text className="text-body-medium font-bold">{step.question}</Text>
            <Text className="text-body-small">{step.description}</Text>
          </div>
          <div>
            <Text className="text-body-small">예시</Text>
            <Text className="text-body-small">- {step.example.bad}</Text>
            <Text className="text-body-small">- {step.example.good}</Text>
          </div>
        </div>
        <div className="flex-1 flex">
          <textarea
            className="flex-1 p-2 rounded-lg border border-gray-300"
            ref={textareaRef}
          />
        </div>
      </div>
    </PageLayout>
  );
}
