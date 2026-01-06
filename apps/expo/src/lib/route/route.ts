import type { Href } from 'expo-router';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  ACT: {
    BASE: '/(act)',
    ANCHOR: {
      BASE: '/(act)/anchor',
      STEP: '/(act)/anchor/step',
      RESULT: '/(act)/anchor/result',
    },
    DIARY: {
      BASE: '/(act)/diary',
      STEP: '/(act)/diary/step',
      RESULT: '/(act)/diary/result',
    },
    DETACH: {
      BASE: '/(act)/detach',
      STEP: '/(act)/detach/step',
      RESULT: '/(act)/detach/result',
    },
    EMBRACE: {
      BASE: '/(act)/embrace',
      STEP: '/(act)/embrace/step',
      RESULT: '/(act)/embrace/result',
    },
    OBSERVER: '/(act)/observer',
    ACTION: '/(act)/action',
  },

  CBT: {
    BASE: '/(cbt)',
    BREATHING: '/(cbt)/breathing',
    DIARY: '/(cbt)/diary',
    GROUNDING: '/(cbt)/grounding',
    LEARNING: '/(cbt)/learning',
    RECOGNITION: '/(cbt)/recognition',
  },

  TEST: {
    BASE: '/(test)',
    BUTTON: '/(test)/button',
    FORM: '/(test)/form',
    IMAGE: '/(test)/image',
    LANG: '/(test)/lang',
    MODAL: '/(test)/modal',
    TEXT: '/(test)/text',
    THEME: '/(test)/theme',
  },
} as const;

export function getActRoute(slug: string): Href {
  return `/(act)/${slug}` as Href;
}

export function getCbtRoute(slug: string): Href {
  return `/(cbt)/${slug}` as Href;
}
