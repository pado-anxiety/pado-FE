'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { handlePostMessage } from '@/lib/webview';

const description = [
  '당신의 생각은 사실이 아닙니다. 그저 마음이 만들어낸 소음일 뿐이에요.',
  '생각에서 한 걸음 물러나 볼까요? 꽉 붙잡지 말고, 그저 스쳐 지나가게 두는 연습을 할 거예요.',
  '불안이라는 가짜 알람의 소리를 줄이고, 진짜 현실을 마주하러 가볼까요?',
];

const steps = [
  '1. 문장 적기: 나를 불안하게 만드는 생각들을 문장으로 적어봅니다.',
  "2. 생각 분리하기: 문장에서 사실이 아닌 '나의 생각' 부분을 직접 드래그하여 선택합니다.",
  '3. 흘려보내기: 선택한 생각이 투명해지며 사라지고, 객관적인 사실만 남는 것을 확인합니다.',
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
    <ActIntroPage
      title="생각 거리두기"
      description={description}
      contentTitle="생각의 힘을 빼는 과정"
      contentDescription="생각을 현실로 착각하지 않고, 단순히 스쳐 지나가는 '단어'로 인식하는 연습입니다."
      steps={steps}
      tipText="Tip: 생각은 뇌가 보내는 '가짜 알람'과 같아요. 소리에 반응하지 말고, 그저 소리가 들린다는 사실만 알아차려 보세요."
      buttonText="거리두기 시작하기"
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
