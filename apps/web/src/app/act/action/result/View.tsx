'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Text } from '@pado/ui';

import ActResultPage from '@/components/act/ActResultPage';
import { handlePostMessage, triggerHaptic } from '@/lib';

export default function ActionResultView() {
  const { t } = useTranslation();
  const data = window.actionResult;

  const handleComplete = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
    triggerHaptic('NAVIGATE');
  };

  return (
    <ActResultPage
      title={[t('act.values.result.title')]}
      description={
        t('act.values.result.description', {
          returnObjects: true,
        }) as string[]
      }
      buttonText={t('common.button.complete')}
      onButtonClick={handleComplete}
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
          <Text className="text-body-small text-sub mb-1">
            {t('act.values.result.selectedDomain')}
          </Text>
          <Text className="text-body-medium break-words leading-relaxed">
            {t(`act.values.domain.${data?.selectedDomain}`)}
          </Text>
        </div>
        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
          <Text className="text-body-small text-sub mb-1">
            {t('act.values.result.orientation')}
          </Text>
          <Text className="text-body-medium break-words leading-relaxed">
            {data?.orientation}
          </Text>
        </div>
        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
          <Text className="text-body-small text-sub mb-1">
            {t('act.values.result.obstacle')}
          </Text>
          <Text className="text-body-medium break-words leading-relaxed">
            {data?.obstacle}
          </Text>
        </div>
        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
          <Text className="text-body-small text-sub mb-1">
            {t('act.values.result.action')}
          </Text>
          <Text className="text-body-medium break-words leading-relaxed">
            {data?.action}
          </Text>
        </div>
      </div>
    </ActResultPage>
  );
}
