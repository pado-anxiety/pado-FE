import { Text } from '@pado/ui';

import { UserTextToken } from '../types';

type ResultDisplayProps = {
  result: UserTextToken[];
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div>
          <Text className="text-title-medium">생각의 거품이 걷히고</Text>
          <Text className="text-title-medium">선명한 사실만 남았어요.</Text>
        </div>
        <Text className="text-body-medium">
          투명해진 문장처럼 생각은 힘을 잃고 결국 사라질 거예요. 이제 흔들리지
          않는 사실 위에서 잠시 숨을 고르셔도 좋아요.
        </Text>
      </div>
      <div
        className="flex flex-row gap-1 flex-wrap border rounded-2xl p-4
      bg-white/50 border-white shadow-sm
      "
      >
        {result.map((item, index) => (
          <div key={`${item.text + index}`}>
            <Text
              className="text-body-medium"
              style={{ opacity: !item.isSelected ? 1 : 0.3 }}
            >
              {item.text}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
