import { View } from '@src/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { CBT_MENU_LIST } from '../constants';
import { CbtButton } from './CbtButton';

export function CbtButtonList(): React.ReactNode {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row flex-wrap justify-center items-center gap-1"
      style={{
        paddingTop: insets.top + scale(20),
        paddingHorizontal: scale(5),
      }}
    >
      {CBT_MENU_LIST.map((item, index) => (
        <CbtButton
          key={index}
          item={item}
        />
      ))}
    </View>
  );
}
