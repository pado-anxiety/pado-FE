import { TFunction } from 'i18next';

import { LearningData } from '../types';

export const getLearningData = (t: TFunction): Record<string, LearningData> => {
  return {
    anxiety_info: {
      title: t('learning.anxiety_info.title'),
      description: t('learning.anxiety_info.description'),
      steps: [
        {
          step: 1,
          title: t('learning.anxiety_info.steps.step1.title'),
          content: t('learning.anxiety_info.steps.step1.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/anxiety_step1.png',
        },
        {
          step: 2,
          title: t('learning.anxiety_info.steps.step2.title'),
          content: t('learning.anxiety_info.steps.step2.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/anxiety_step2.png',
        },
        {
          step: 3,
          title: t('learning.anxiety_info.steps.step3.title'),
          content: t('learning.anxiety_info.steps.step3.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/anxiety_step3.png',
        },
        {
          step: 4,
          title: t('learning.anxiety_info.steps.step4.title'),
          content: t('learning.anxiety_info.steps.step4.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/anxiety_step4.png',
        },
        {
          step: 5,
          title: t('learning.anxiety_info.steps.step5.title'),
          content: t('learning.anxiety_info.steps.step5.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/anxiety_step5.png',
        },
      ],
    },
    act_guide: {
      title: t('learning.act_guide.title'),
      description: t('learning.act_guide.description'),
      steps: [
        {
          step: 1,
          title: t('learning.act_guide.steps.step1.title'),
          content: t('learning.act_guide.steps.step1.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/act_step1.png',
        },
        {
          step: 2,
          title: t('learning.act_guide.steps.step2.title'),
          content: t('learning.act_guide.steps.step2.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/act_step2.png',
        },
        {
          step: 3,
          title: t('learning.act_guide.steps.step3.title'),
          content: t('learning.act_guide.steps.step3.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/act_step3.png',
        },
        {
          step: 4,
          title: t('learning.act_guide.steps.step4.title'),
          content: t('learning.act_guide.steps.step4.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/act_step4.png',
        },
        {
          step: 5,
          title: t('learning.act_guide.steps.step5.title'),
          content: t('learning.act_guide.steps.step5.content', {
            returnObjects: true,
          }) as string[],
          image: '/images/learning/act_step5.png',
        },
      ],
    },
  };
};
