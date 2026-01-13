'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActResultPage from '@/components/act/ActResultPage';
import { handlePostMessage, triggerHaptic } from '@/lib';

export default function AnchorResultPage() {
  const { t } = useTranslation();

  const handleComplete = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
    triggerHaptic('NAVIGATE');
  };

  return (
    <ActResultPage
      title={[t('act.anchor.result.title')]}
      description={t('act.anchor.result.description')}
      buttonText={t('common.button.complete')}
      onButtonClick={handleComplete}
    >
      <div />
    </ActResultPage>
  );
}
