'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActResultPage from '@/components/act/ActResultPage';
import { ResultDisplay } from '@/features/act/detach';
import { handlePostMessage } from '@/lib';

export default function DetachResultView() {
  const data = window.detachResult;

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <ActResultPage
      title={['생각의 거품이 걷히고', '사실만 남았어요.']}
      description="투명해진 문장처럼 생각은 생각일 뿐이에요. 이제 흔들리지 않는 사실 위에서 잠시 숨을 고르셔도 좋아요."
      buttonText="다음"
      onButtonClick={handleStart}
    >
      <ResultDisplay result={data || []} />
    </ActResultPage>
  );
}
