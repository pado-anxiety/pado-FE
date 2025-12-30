'use client';

import { useSyncExternalStore } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib';

const subscribe = () => () => {};
const getSnapshot = () =>
  typeof window !== 'undefined' ? window.diaryResult : null;
const getServerSnapshot = () => null;

export default function DiaryResultPage() {
  const rawData = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // 이제 여기서 데이터를 파싱해서 사용
  if (!rawData) return <div>Loading...</div>;

  const result = rawData.data;

  const handleNextStep = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  const safeParse = (str: any) => {
    try {
      let result = str;
      // 타입이 string인 동안 계속 parse를 시도합니다.
      while (typeof result === 'string') {
        result = JSON.parse(result);
      }
      return result;
    } catch (e) {
      return str; // 파싱 실패 시 원본 반환
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col flex-1 justify-between items-center">
        <div className="flex flex-1 justify-center items-center">
          <Text className="text-title-medium">마음 일기 결과</Text>
          <Text>{JSON.stringify(result)}</Text>
          <Text>{typeof safeParse(result)}</Text>
          {/* {result &&
            result.map((item) => (
              <div key={item.question}>
                <Text>{item.question}</Text>
                <Text>{item.answer}</Text>
              </div>
            ))} */}
        </div>
        <Button
          size="default"
          text="다음"
          onClick={handleNextStep}
        />
      </div>
    </PageLayout>
  );
}
