import { View } from '@src/components/ui';

import { ACT_MENU_LIST } from '../../constants';
import { ActStep } from './ActStep';

export function ActList(): React.ReactNode {
  return (
    <View className="flex-1 flex-col items-center gap-24">
      {ACT_MENU_LIST.map((item, index) => (
        <ActStep
          key={index}
          item={item}
        />
      ))}
    </View>
  );
}
