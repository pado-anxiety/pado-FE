'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { handlePostMessage } from '@/lib';
import { useDuration } from '@/lib/analytics/useDuration';

export default function ActionPage() {
  const { t } = useTranslation();

  const { getDuration } = useDuration();

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
      duration: getDuration(),
    });
  };

  const handleClose = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
      duration: getDuration(),
    });
  };

  return (
    <ActIntroPage
      title={t('act.values.intro.title')}
      description={
        t('act.values.intro.description', { returnObjects: true }) as string[]
      }
      contentTitle={t('act.values.intro.contentTitle')}
      contentDescription={t('act.values.intro.contentDescription')}
      steps={t('act.values.intro.steps', { returnObjects: true }) as string[]}
      tipText={t('act.values.intro.tip')}
      buttonText={t('common.button.start')}
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
