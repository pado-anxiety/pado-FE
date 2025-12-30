'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import { DiaryResult } from '@/features/diary/types';
import { handlePostMessage } from '@/lib';

export default function DiaryResultView() {
  const data = window.diaryResult.data;
  const parsedData = JSON.parse(data as unknown as string) as DiaryResult[];

  const handleComplete = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="flex flex-1 flex-col gap-4 justify-center">
        <Text className="text-title-medium">마음 일기 결과</Text>
        <div className="flex flex-col gap-2">
          {parsedData.map((item: DiaryResult) => (
            <div
              key={item.question}
              className="bg-primary p-4 rounded-lg"
            >
              <Text>{item.question}</Text>
              <Text>{item.answer}</Text>
            </div>
          ))}
        </div>
      </div>
      <Button
        text="완료"
        onClick={handleComplete}
      />
    </div>
  );
}
