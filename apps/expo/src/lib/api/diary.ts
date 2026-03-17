import { apiClient } from './client';

const SILENT_CONFIG = { _silentAuthFailure: true } as const;

// ── Types ────────────────────────────────────────────────

export type DiaryCreateRequest = {
  situation: string;
  thoughts: string;
  feelings: string[];
};

export type DiaryDetail = {
  time: string;
  situation: string;
  thoughts: string;
  feelings: string[];
};

export type DiaryMonthlyEntry = {
  id: number;
  time: string;
  feelings: string[];
};

// ── API ──────────────────────────────────────────────────

export const diaryAPI = {
  /** POST /diaries */
  create: async (body: DiaryCreateRequest): Promise<void> => {
    await apiClient.post('/diaries', body, SILENT_CONFIG);
  },

  /** GET /diaries/{id} */
  getDetail: async (id: number): Promise<DiaryDetail> => {
    const response: DiaryDetail = await apiClient.get(`/diaries/${id}`);
    return response;
  },

  /** GET /diaries?year=YYYY&month=M */
  getMonthly: async (
    year: number,
    month: number,
  ): Promise<DiaryMonthlyEntry[]> => {
    const response: DiaryMonthlyEntry[] = await apiClient.get(
      `/diaries?year=${year}&month=${month}`,
    );
    return response;
  },
};
