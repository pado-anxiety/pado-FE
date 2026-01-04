import { Text } from '@pado/ui';

import { UserTextToken } from '../types';

type ResultDisplayProps = {
  result: UserTextToken[];
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div className="flex flex-row gap-1 flex-wrap border rounded-2xl p-4 bg-white/50 border-white shadow-sm">
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
  );
}
