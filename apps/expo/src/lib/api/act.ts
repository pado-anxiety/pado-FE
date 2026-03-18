import { apiClient } from './client';

/** @deprecated Use ACT_ENDPOINTS instead */
export const ROUTES = {
  ANCHOR: '/records/contact-with-present',
  DIARY: '/records/emotion-note',
  DETACH: '/records/cognitive-defusion',
  EMBRACE: '/records/acceptance',
  VALUES: '/records/committed-action',
} as const;

const ACT_ENDPOINTS = {
  ANCHOR: '/records/contact-with-present',
  DIARY: '/records/emotion-note',
  DETACH: '/records/cognitive-defusion',
  EMBRACE: '/records/acceptance',
  VALUES: '/records/committed-action',
} as const;

const SILENT_CONFIG = { _silentAuthFailure: true } as const;

export const actAPI = {
  anchor: async (): Promise<void> => {
    await apiClient.post(ACT_ENDPOINTS.ANCHOR, null, SILENT_CONFIG);
  },
  diary: async ({
    situation,
    thoughts,
    feelings,
  }: {
    situation: string;
    thoughts: string;
    feelings: string;
  }): Promise<void> => {
    await apiClient.post(
      ACT_ENDPOINTS.DIARY,
      { situation, thoughts, feelings },
      SILENT_CONFIG,
    );
  },
  detach: async ({
    userTextToken,
  }: {
    userTextToken: { text: string; isSelected: boolean }[];
  }): Promise<void> => {
    await apiClient.post(ACT_ENDPOINTS.DETACH, { userTextToken }, SILENT_CONFIG);
  },
  embrace: async ({
    breathingTime,
  }: {
    breathingTime: number;
  }): Promise<void> => {
    await apiClient.post(ACT_ENDPOINTS.EMBRACE, { breathingTime }, SILENT_CONFIG);
  },
  values: async ({
    diagnosis,
    matter,
    value,
    barrier,
    action,
  }: {
    diagnosis: {
      work: number;
      growth: number;
      leisure: number;
      relationship: number;
    };
    matter: string;
    value: string;
    barrier: string;
    action: string;
  }): Promise<void> => {
    await apiClient.post(
      ACT_ENDPOINTS.VALUES,
      {
        diagnosis: {
          work: diagnosis.work,
          growth: diagnosis.growth,
          leisure: diagnosis.leisure,
          relationship: diagnosis.relationship,
        },
        matter: matter,
        value: value,
        barrier: barrier,
        action: action,
      },
      SILENT_CONFIG,
    );
  },
};
