'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@pado/lib/route';
import { Button, Text } from '@pado/ui';

type Step = {
  id: string;
  subject: string;
  description: string[];
  example: string;
  count: number;
};

const funnel: Step[] = [
  {
    id: 'step1',
    subject: '지금 보이는 5가지',
    description: ['주위에 있는 물건', '5가지를 찾아보세요'],
    example: '책상 위에 놓인 책',
    count: 5,
  },
  {
    id: 'step2',
    subject: '만질 수 있는 4가지',
    example: '얼음물이 담긴 물컵',
    description: ['4가지 물체의 온도와', '질감을 느껴보세요'],
    count: 4,
  },
  {
    id: 'step3',
    subject: '들을 수 있는 3가지',
    example: '새 소리',
    description: ['소리에 집중하여', '주변의 소리 3가지를 들어보세요'],
    count: 3,
  },
  {
    id: 'step4',
    subject: '맡을 수 있는 2가지 냄새',
    example: '향수 냄새',
    description: ['주위에 있는 것들에서', '2가지 냄새를 맡아보세요'],
    count: 2,
  },
  {
    id: 'step5',
    subject: '맛을 볼 수 있는 1가지',
    example: '지금 맛을 볼 수 없다면, 좋아하는 맛을 상상해도 좋아요',
    description: ['지금 맛을 볼 수 없다면,', '좋아하는 맛을 상상해도 좋아요'],
    count: 1,
  },
];

export default function AnchorStepPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const step = funnel[stepIndex];

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const unit = (100 / step.count) * 0.01;

  const handleNextStep = () => {
    if (selectedIndex !== step.count) {
      return;
    }
    if (stepIndex < funnel.length - 1) {
      setStepIndex(stepIndex + 1);
      setSelectedIndex(0);
      return;
    }
    router.push(ROUTES.ANCHOR_RESULT);
  };

  const radius = 35;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - unit * selectedIndex);

  return (
    <div className="flex flex-col flex-1 justify-between items-center">
      <div className="relative w-full aspect-square">
        <svg
          className="w-full aspect-square overflow-visible absolute top-0 left-0"
          viewBox="0 0 100 100"
        >
          <circle
            key={stepIndex}
            r={radius}
            cx="50"
            cy="50"
            fill="none"
            stroke="blue"
            opacity={0.5}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="flex-1 flex flex-col justify-center items-center absolute top-0 left-0 w-full aspect-square z-100">
          <Text className="text-title-large">{step.subject}</Text>
          {step.description.map((desc, index) => (
            <Text
              key={index}
              className="text-body-large"
            >
              {desc}
            </Text>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-12">
        <Text className="text-body-large">예시: {step.example}</Text>
        <div className="flex flex-row gap-2">
          {Array.from({ length: step.count }).map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index + 1)}
              className={`w-10 h-10 rounded-full ${selectedIndex === index + 1 ? 'bg-primary' : 'bg-gray-200'} ${index < selectedIndex - 1 ? 'opacity-50' : 'opacity-100'}`}
              disabled={index !== selectedIndex}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <Button
        size="default"
        text="다음"
        onClick={handleNextStep}
      />
    </div>
  );
}
