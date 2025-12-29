import type { Href } from 'expo-router';

export const ROUTES = {
  HOME: '/',

  ACT: {
    BASE: '/(act)',
    ANCHOR: {
      BASE: '/(act)/anchor',
      STEP: '/(act)/anchor/step',
      RESULT: '/(act)/anchor/result',
    },
    REFLECTION: '/(act)/reflection',
    DETACH: '/(act)/detach',
    EMBRACE: '/(act)/embrace',
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
