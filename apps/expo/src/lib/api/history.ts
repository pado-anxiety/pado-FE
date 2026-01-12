import { ACTType, ActHistory } from '@src/features/History/types';

import { useAuth } from '../auth';
import { apiClient } from './client';

export type HistoryAPI = {
  cursor: number | null;
  hasNext: boolean;
  content: {
    id: number;
    type: ACTType;
    time: string;
  }[];
};

export const historyAPI = {
  getHistory: async (cursor: number | null): Promise<HistoryAPI> => {
    let url = '/records';
    if (cursor) {
      url += `?cursor=${cursor}`;
    }
    console.log(useAuth.getState().accessToken);
    console.log('url: ', url);
    const response: HistoryAPI = await apiClient.get(url);

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('response: ', response);

    return response;
  },
  getDetail: async (id: number): Promise<ActHistory> => {
    const response: ActHistory = await apiClient.get(`/records/${id}`);
    return response;
  },
};
