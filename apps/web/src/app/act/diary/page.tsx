'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { handlePostMessage } from '@/lib/webview';

const description = [
  '불안은 사건 그 자체가 아니라, 사건을 바라보는 나의 "해석"에서 시작됩니다.',
  '따라서 상황과 감정 사이에 숨어 나를 불안하게 만드는 "자동적 사고"를 찾아내야 해요.',
  '불안의 원인이 된 생각을 발견하러 가볼까요?',
];

const steps = [
  '1. 상황 (Fact): 언제, 어디서, 무슨 일이 있었나요?',
  '2. 생각 (Thought): 그때 머릿속을 스쳐 지나간 생각은 무엇인가요?',
  '3. 감정 (Emotion): 그 생각으로 인해 어떤 감정을 느꼈나요?',
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
    <ActIntroPage
      title="마음 일기"
      description={description}
      contentTitle="마음의 흐름을 읽는 3단계"
      contentDescription="엉켜있는 마음을 상황, 생각, 감정으로 나누어 정리하는 '생각 분리' 기법입니다."
      steps={steps}
      tipText="Tip: '생각'은 사실이 아닙니다. 내가 상황을 어떻게 해석했는지 발견하는 것이 핵심이에요."
      buttonText="시작하기"
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
