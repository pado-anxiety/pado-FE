import { scale } from 'react-native-size-matters';

import { View } from '@src/components/ui';

import { ActList } from './Act/ActList';

export function DeepSeaSection(): React.ReactNode {
  return (
    <View className="flex-1 bg-[#010C1E]">
      <View
        className="z-10 flex-1 items-center bg-[#003366]"
        style={{
          paddingTop: scale(100),
          top: -scale(150),
        }}
      >
        <ActList />
      </View>
    </View>
  );
}
