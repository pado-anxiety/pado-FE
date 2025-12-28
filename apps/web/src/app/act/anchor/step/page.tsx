'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@pado/ui';

type Step = {
  id: string;
  subject: string;
  description: string;
  example: string;
  count: number;
};

const funnel: Step[] = [
  {
    id: 'step1',
    subject: '지금 보이는 5가지',
    description: '주위에 있는 물건 5가지를 찾아보세요',
    example: '책상 위에 놓인 책',
    count: 5,
  },
  {
    id: 'step2',
    subject: '만질 수 있는 4가지',
    example: '4가지 물체의 온도와 질감을 느껴보세요',
    description: '4가지 물체의 온도와 질감을 느껴보세요',
    count: 4,
  },
  {
    id: 'step3',
    subject: '들을 수 있는 3가지',
    example: '소리에 집중하여 주변의 소리 3가지를 들어보세요',
    description: '소리에 집중하여 주변의 소리 3가지를 들어보세요',
    count: 3,
  },
  {
    id: 'step4',
    subject: '맡을 수 있는 2가지 냄새',
    example: '주위에 있는 것들에서 2가지 냄새를 맡아보세요',
    description: '주위에 있는 것들에서 2가지 냄새를 맡아보세요',
    count: 2,
  },
  {
    id: 'step5',
    subject: '맛을 볼 수 있는 1가지',
    example: '지금 맛을 볼 수 없다면, 좋아하는 맛을 상상해도 좋아요',
    description: '지금 맛을 볼 수 없다면, 좋아하는 맛을 상상해도 좋아요',
    count: 1,
  },
];

export default function AnchorStepPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const step = funnel[stepIndex];

  const handleNextStep = () => {
    if (stepIndex < funnel.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    router.push('/act/anchor/result');
  };

  return (
    <div className="flex flex-col flex-1 justify-between items-center bg-blue-100">
      <div>
        <h1>{step.subject}</h1>
        <p>{step.description}</p>
      </div>
      <p>{step.example}</p>
      <p>{step.count}</p>
      <Button
        size="default"
        text="다음"
        onClick={handleNextStep}
      />
    </div>
  );
}
