'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActResultPage from '@/components/act/ActResultPage';
import { ResultDisplay } from '@/features/act/detach';
import { handlePostMessage, triggerHaptic } from '@/lib';

export default function DetachResultView() {
  const { t } = useTranslation();
  const data = window.detachResult;

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
    triggerHaptic('NAVIGATE');
  };

  const title = t('act.detach.result.title', {
    returnObjects: true,
  }) as string[];

  return (
    <ActResultPage
      title={title}
      description={
        t('act.detach.result.description', {
          returnObjects: true,
        }) as string[]
      }
      buttonText={t('common.button.next')}
      onButtonClick={handleStart}
    >
      <ResultDisplay result={data || []} />
    </ActResultPage>
  );
}
