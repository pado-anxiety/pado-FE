'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { triggerHaptic } from '@/lib/haptic';
import { handlePostMessage } from '@/lib/webview';

export default function DefusionPage() {
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
      title={t('act.detach.intro.title')}
      description={
        t('act.detach.intro.description', { returnObjects: true }) as string[]
      }
      contentTitle={t('act.detach.intro.contentTitle')}
      contentDescription={t('act.detach.intro.contentDescription')}
      steps={t('act.detach.intro.steps', { returnObjects: true }) as string[]}
      tipText={t('act.detach.intro.tip')}
      buttonText={t('act.detach.intro.button')}
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
