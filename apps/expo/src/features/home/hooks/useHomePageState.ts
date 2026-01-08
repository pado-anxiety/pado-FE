import { useState } from 'react';

import { PageType } from '../types';

export const useHomePageState = () => {
  const [page, setPage] = useState<PageType>('HOME');

  return {
    page,
    setPage,
  };
};
