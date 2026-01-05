'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Text } from '@pado/ui';

import ActResultPage from '@/components/act/ActResultPage';
import { handlePostMessage } from '@/lib';

export default function EmbraceResultView() {
  const data = window.embraceResult;

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <ActResultPage
      title={['마음의 바다가 넓어졌어요']}
      description="불안이라는 파도는 때때로 거세게 일렁이며 우리를 찾아옵니다. 우리는 흔히 그 파도를 없애거나 줄이려 애쓰지만, 사실 파도의 크기를 우리가 마음대로 조절할 수는 없어요. 하지만 우리가 안에는 이 파도를 품어줄 수 있는 바다가 있어요. 파도를 억지로 밀어내는 대신, 호흡을 통해 그 파도가 머무는 당신의 바다를 더 넓고 깊게 확장했어요. 파도의 크기는 그대로일지라도, 이제 당신의 바다는 그 어떤 불안도 넉넉히 품어낼 수 있을 만큼 거대해졌습니다."
      buttonText="다음"
      onButtonClick={handleStart}
    >
      <Text className="text-body-large bg-white/60 p-4 rounded-2xl border border-white shadow-sm w-full">
        총 {data}초 동안 호흡했어요.
      </Text>
    </ActResultPage>
  );
}
