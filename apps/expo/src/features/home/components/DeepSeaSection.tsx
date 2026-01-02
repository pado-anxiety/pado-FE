import { View } from '@src/components/ui';

import { ActList } from './Act/ActList';

export function DeepSeaSection(): React.ReactNode {
  return (
    <View className="flex-1 bg-[#003366] items-center z-10">
      <ActList />
    </View>
  );
}
