import { scale } from 'react-native-size-matters';

import { LoadingSpinner, View } from '@src/components/ui';

import { PageType } from '../types';

interface HomeListFooterProps {
  page: PageType;
  isFetchingNextPage: boolean;
  isPending: boolean;
  isHistoryEmpty?: boolean;
}

export const HomeListFooter = ({
  page,
  isFetchingNextPage,
  isPending,
  isHistoryEmpty,
}: HomeListFooterProps) => {
  if (page === 'HOME' || page === 'CHAT') {
    return null;
  }

  if (isHistoryEmpty) {
    return null;
  }

  if (page === 'HISTORY' && isPending) {
    return (
      <View className="w-full flex-1 items-center justify-center bg-transparent">
        <LoadingSpinner />
      </View>
    );
  }

  if (page === 'HISTORY' && isFetchingNextPage) {
    return (
      <View
        className="w-full flex-1 items-center justify-center bg-ocean-front"
        style={{
          paddingVertical: scale(50),
        }}
      >
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-ocean-front"
      style={{ height: scale(50) }}
    />
  );
};
