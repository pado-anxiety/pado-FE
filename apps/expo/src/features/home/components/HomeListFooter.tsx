import { ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';

import { View } from '@src/components/ui';

interface HomeListFooterProps {
  isFetchingNextPage: boolean;
}

export const HomeListFooter = ({ isFetchingNextPage }: HomeListFooterProps) => {
  if (!isFetchingNextPage) {
    return (
      <View
        className="bg-[#003366]"
        style={{ height: scale(50) }}
      />
    );
  }

  return (
    <View
      className="w-full flex-1 items-center justify-center bg-[#003366]"
      style={{ paddingVertical: scale(50) }}
    >
      <ActivityIndicator
        size="small"
        color="white"
      />
    </View>
  );
};
