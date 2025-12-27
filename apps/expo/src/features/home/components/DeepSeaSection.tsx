import { View } from '@src/components/ui';
import { scale } from 'react-native-size-matters';

import { ActList } from './Act/ActList';

export function DeepSeaSection(): React.ReactNode {
  return (
    <View
      className="flex-1 bg-[#000080] items-center z-10"
      style={{
        marginTop: -scale(2),
        paddingTop: scale(50),
      }}
    >
      <ActList />
    </View>
  );
}
