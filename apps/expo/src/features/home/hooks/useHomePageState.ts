import { useCallback, useState } from 'react';

import { useAnalytics } from '@src/lib/analytics';

import { PageType } from '../types';

export const useHomePageState = () => {
  const [page, setPageState] = useState<PageType>('HOME');
  const { trackPageView } = useAnalytics();

  const setPage = useCallback(
    (newPage: PageType) => {
      setPageState(newPage);
      trackPageView(newPage);
    },
    [trackPageView],
  );

  return {
    page,
    setPage,
  };
};
