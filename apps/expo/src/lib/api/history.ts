import { ACTType, ActHistory } from '@src/features/History/types';

import { apiClient } from './client';

export type HistoryAPI = {
  cursor: string | null;
  hasNext: boolean;
  content: {
    id: string;
    type: ACTType;
    time: string;
  }[];
};

export const historyAPI = {
  getHistory: async (cursor: string | null): Promise<HistoryAPI> => {
    let url = '/records';
    if (cursor) {
      url += `?cursor=${cursor}`;
    }
    console.log('url: ', url);
    const response: HistoryAPI = await apiClient.get(url);

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('히스토리: ', response);

    return response;
  },
  getDetail: async (id: string): Promise<ActHistory> => {
    const response: ActHistory = await apiClient.get(`/records/${id}`);

    return response;
  },
};
