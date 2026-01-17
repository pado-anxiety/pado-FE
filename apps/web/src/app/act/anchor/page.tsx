'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { handlePostMessage, triggerHaptic } from '@/lib';
import { useDuration } from '@/lib/analytics/useDuration';

export default function AnchorPage() {
  const { t } = useTranslation();

  const { getDuration } = useDuration();

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
      duration: getDuration(),
    });
    triggerHaptic('NAVIGATE');
  };

  const handleClose = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
      duration: getDuration(),
    });
  };

  return (
    <ActIntroPage
      title={t('act.anchor.intro.title')}
      description={
        t('act.anchor.intro.description', { returnObjects: true }) as string[]
      }
      contentTitle={t('act.anchor.intro.contentTitle')}
      contentDescription={t('act.anchor.intro.contentDescription')}
      steps={t('act.anchor.intro.steps', { returnObjects: true }) as string[]}
      tipText={t('act.anchor.intro.tip')}
      buttonText={t('common.button.start')}
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
