'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Text } from '@pado/ui';
import { ChevronsDown } from 'lucide-react';

import ActResultPage from '@/components/act/ActResultPage';
import { DiaryResult } from '@/features/act/diary/types';
import { handlePostMessage } from '@/lib';
import { parseJSON } from '@/lib/json';

export default function DiaryResultView() {
  const data = window.diaryResult;

  const parsedData = parseJSON(data as unknown as string, () => {
    return {};
  }) as DiaryResult[];

  const handleComplete = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <ActResultPage
      title={["어떤 바람이 '불안'이라는 파도를 만들었는지 살펴보았어요"]}
      description="높은 파도는 '생각'이라는 바람이 만든 잠시뿐인 일렁임일 뿐, 바람이 지나가면 파도는 다시 고요해질 거예요."
      buttonText="완료"
      onButtonClick={handleComplete}
    >
      <div className="flex flex-col gap-2">
        {parsedData.map((item: DiaryResult, index: number) => (
          <div
            key={item.question}
            className="flex flex-col gap-2 justify-center items-center w-full"
          >
            <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm w-full">
              <Text className="text-body-medium font-bold">
                {item.question}
              </Text>
              <Text className="text-body-medium text-gray-700 break-words leading-relaxed">
                {item.answer}
              </Text>
              {item.feels && (
                <div className="flex flex-row gap-2">
                  {item.feels.map((feel, index) => (
                    <Text
                      key={feel}
                      className="text-body-small text-gray-700"
                    >
                      {feel + (index !== item.feels!.length - 1 ? ',' : '')}
                    </Text>
                  ))}
                </div>
              )}
            </div>
            {index !== parsedData.length - 1 && <ChevronsDown size={30} />}
          </div>
        ))}
      </div>
    </ActResultPage>
  );
}
