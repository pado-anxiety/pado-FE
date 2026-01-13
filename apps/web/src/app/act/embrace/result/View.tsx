'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Text } from '@pado/ui';

import ActResultPage from '@/components/act/ActResultPage';
import { handlePostMessage, triggerHaptic } from '@/lib';

export default function EmbraceResultView() {
  const { t } = useTranslation();
  const data = window.embraceResult;

  const handleStart = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
    triggerHaptic('NAVIGATE');
  };

  return (
    <ActResultPage
      title={[t('act.embrace.result.title')]}
      description={t('act.embrace.result.description')}
      buttonText={t('common.button.next')}
      onButtonClick={handleStart}
    >
      <Text className="text-body-large bg-white/60 p-4 rounded-2xl border border-white shadow-sm w-full">
        {t('act.embrace.result.breathTime', { seconds: data })}
      </Text>
    </ActResultPage>
  );
}
