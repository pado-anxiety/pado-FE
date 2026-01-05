'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { handlePostMessage } from '@/lib';

const description = [
  '불안이라는 파도를 억지로 잠재우려 애쓰지 않아도 괜찮아요.',
  '파도는 바다의 일부일 뿐, 바다 그 자체를 해칠 수는 없습니다.',
  '이제 내 안의 바다를 넓혀, 불안이 안전하게 머물 수 있는 공간을 만들어 볼까요?',
  '호흡을 통해 파도 아래에 숨겨진 깊고 고요한 나를 만나보세요.',
];

const steps = [
  '1. 파도가 올라올 때, 숨을 깊게 들이마시며 마음의 그릇을 넓혀요.',
  '2. 파도가 내려갈 때, 숨을 천천히 내쉬며 불안이 머물게 두어요.',
  '3. 일렁이는 파도 아래, 흔들림 없는 깊은 바다(나)를 느껴보세요.',
];

export default function EmbracePage() {
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
      title="기꺼이 수용하기"
      description={description}
      contentTitle="파도 호흡법"
      contentDescription="파도의 리듬에 맞춰 숨을 쉬며, 불안을 수용하는 마음의 공간을 넓히는 연습입니다."
      steps={steps}
      tipText="Tip: 불안을 없애려 하기보다, 내 안에 불안이 들어올 자리를 넉넉히 마련해준다고 생각해보세요."
      buttonText="시작하기"
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
