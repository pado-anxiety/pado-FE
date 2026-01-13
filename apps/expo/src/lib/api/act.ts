import { apiClient } from './client';

export const ROUTES = {
  ANCHOR: '/records/contact-with-present',
  DIARY: '/records/emotion-note',
  DETACH: '/records/cognitive-defusion',
  EMBRACE: '/records/acceptance',
  VALUES: '/records/committed-action',
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
    console.log('situation', situation);
    console.log('thoughts', thoughts);
    console.log('feelings', feelings);
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
    await apiClient.post(ROUTES.VALUES, {
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
    });
  },
};
