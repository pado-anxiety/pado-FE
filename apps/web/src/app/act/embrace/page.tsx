'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { handlePostMessage, triggerHaptic } from '@/lib';

export default function EmbracePage() {
  const { t } = useTranslation();

  const handleStart = () => {
    triggerHaptic('NAVIGATE');
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
    });
  };

  const handleClose = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <ActIntroPage
      title={t('act.embrace.intro.title')}
      description={
        t('act.embrace.intro.description', { returnObjects: true }) as string[]
      }
      contentTitle={t('act.embrace.intro.contentTitle')}
      contentDescription={t('act.embrace.intro.contentDescription')}
      steps={t('act.embrace.intro.steps', { returnObjects: true }) as string[]}
      tipText={t('act.embrace.intro.tip')}
      buttonText={t('common.button.start')}
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
