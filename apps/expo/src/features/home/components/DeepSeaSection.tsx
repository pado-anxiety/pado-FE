import { View } from '@src/components/ui';

import { ActList } from './Act/ActList';

export function DeepSeaSection(): React.ReactNode {
  return (
    <View className="flex-1 bg-[#010C1E]">
      <View className="relative z-10 flex-1 items-center">
        <ActList />
      </View>
    </View>
  );
}
