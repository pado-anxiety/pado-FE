import { Text } from '@pado/ui';

import { UserTextToken } from '../types';

type ResultDisplayProps = {
  result: UserTextToken[];
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 justify-center">
      <Text className="text-title-medium">
        사실만 남겨보았어요 ~(추가 문구)
      </Text>
      <div className="flex flex-row gap-1 flex-wrap border border-gray-200 rounded-lg p-2">
        {result.map((item, index) => (
          <div key={`${item.text + index}`}>
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
  );
}
