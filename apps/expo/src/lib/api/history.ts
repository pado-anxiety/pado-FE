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
    const response: HistoryAPI = await apiClient.get(url);

    return response;
  },
  getDetail: async (id: string): Promise<ActHistory> => {
    const response: ActHistory = await apiClient.get(`/records/${id}`);

    return response;
  },
};
