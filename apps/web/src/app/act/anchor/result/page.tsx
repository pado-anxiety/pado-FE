'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActResultPage from '@/components/act/ActResultPage';
import { handlePostMessage } from '@/lib';

export default function AnchorResultPage() {
  const handleComplete = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <ActResultPage
      title={['무사히 닻을 내렸습니다']}
      description="주변의 감각들을 하나씩 일깨우며 현재에 닻을 내렸어요. 이제 어지러운 생각들 대신 지금 이 순간의 평온함에 온전히 집중할 수 있습니다. 이제 준비는 되었습니다. 다음 단계인 감정일기를 통해 내 안에 숨겨진 진짜 감정을 알아가는 연습을 시작해 보세요."
      buttonText="완료"
      onButtonClick={handleComplete}
    >
      <div />
    </ActResultPage>
  );
}
