import { apiClient } from './client';

export const ROUTES = {
  ANCHOR: '/records/contact-with-present',
  DIARY: '/records/emotion-note',
  DETACH: '/records/cognitive-defusion',
  EMBRACE: '/records/acceptance',
  VALUES: '/records/values',
} as const;

export const actAPI = {
  anchor: async (): Promise<void> => {
    await apiClient.post(ROUTES.ANCHOR);
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
    await apiClient.post(ROUTES.DIARY, {
      situation,
      thoughts,
      feelings,
    });
  },
  detach: async ({
    userTextToken,
  }: {
    userTextToken: { text: string; isSelected: boolean }[];
  }): Promise<void> => {
    await apiClient.post(ROUTES.DETACH, {
      userTextToken,
    });
  },
  embrace: async ({
    breathingTime,
  }: {
    breathingTime: number;
  }): Promise<void> => {
    await apiClient.post(ROUTES.EMBRACE, {
      breathingTime,
    });
  },
  values: async ({
    value,
    reason,
    action,
  }: {
    value: string;
    reason: string;
    action: string;
  }): Promise<void> => {
    await apiClient.post(ROUTES.VALUES, {
      value,
      reason,
      action,
    });
  },
};
