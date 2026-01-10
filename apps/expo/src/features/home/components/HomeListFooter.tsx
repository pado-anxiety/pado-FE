import { ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';

import { View } from '@src/components/ui';

import { PageType } from '../types';

interface HomeListFooterProps {
  page: PageType;
  isFetchingNextPage: boolean;
  isPending: boolean;
}

export const HomeListFooter = ({
  page,
  isFetchingNextPage,
  isPending,
}: HomeListFooterProps) => {
  if (page === 'HOME') {
    return;
  }

  if (page === 'HISTORY' && isPending) {
    return (
      <View className="w-full flex-1 items-center justify-center bg-transparent">
        <ActivityIndicator
          size="large"
          color="white"
        />
      </View>
    );
  }

  if (page === 'HISTORY' && isFetchingNextPage) {
    return (
      <View
        className="w-full flex-1 items-center justify-center bg-[#003366]"
        style={{
          paddingVertical: scale(50),
        }}
      >
        <ActivityIndicator
          size="large"
          color="white"
        />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-[#003366]"
      style={{ height: scale(50) }}
    />
  );
};
