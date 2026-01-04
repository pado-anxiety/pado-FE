'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { handlePostMessage } from '@/lib';

const description = [
  '불안의 파도가 몰아칠 때, 가장 먼저 해야 할 일은 "지금, 여기" 에 닻을 내리는 것입니다.',
  '불안을 흘려보내기 전에, 잠시 멈춰 서서 숨을 고를 필요가 있어요.',
  '복잡한 생각의 전원을 잠시 끄고, 오직 지금 이 순간 내 몸과 주변이 보내는 감각에만 집중해 보세요.',
  '이 과정은 불안을 안전하게 흘려보내기 위한 가장 단단한 기초가 됩니다.',
];

const steps = [
  '1. 눈에 보이는 것 5가지 찾기',
  '2. 만질 수 있는 4가지 느끼기',
  '3. 귀에 들리는 소리 3가지 집중하기',
  '4. 코로 맡아지는 냄새 2가지 찾기',
  '5. 입에서 느껴지는 맛 1가지 느끼기',
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
    <ActIntroPage
      title="현재에 집중하기"
      description={description}
      contentTitle="5-4-3-2-1 감각 관찰법"
      contentDescription="오감을 활용해 마음의 닻을 내리는 접지(grounding) 기법입니다."
      steps={steps}
      tipText="Tip: 판단하지 않고, 있는 그대로의 감각에만 천천히 집중해 보세요."
      buttonText="시작하기"
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
