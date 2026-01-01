'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib';

export default function DetachResultView() {
  const data = window.detachResult.data;

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
  };

  return (
    <PageLayout>
      <div className="flex flex-1 flex-col justify-between items-center">
        <div className="flex flex-1 flex-col gap-2 justify-center">
          <Text className="text-title-medium">
            사실만 남겨보았어요 ~(추가 문구)
          </Text>
          <div className="flex flex-row gap-1 flex-wrap border border-gray-200 rounded-lg p-2">
            {data.map((item) => (
              <div key={item.text}>
                <Text
                  className="text-body-medium"
                  style={{ opacity: !item.isSelected ? 1 : 0.2 }}
                >
                  {item.text}
                </Text>
              </div>
            ))}
          </div>
          <Text className="text-body-medium">
            (추가 문구) 생각은 생각일 뿐 사실과 분리하여~
          </Text>
        </div>
        <Button
          size="default"
          text="다음"
          onClick={handleStart}
        />
      </div>
    </PageLayout>
  );
}
