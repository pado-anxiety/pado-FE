'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Text } from '@pado/ui';

import ActResultPage from '@/components/act/ActResultPage';
import { handlePostMessage } from '@/lib';

export default function ActionResultView() {
  const { t } = useTranslation();
  const data = window.actionResult;

  const handleComplete = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  return (
    <ActResultPage
      title={[t('act.values.result.title')]}
      description={t('act.values.result.description')}
      buttonText={t('common.button.complete')}
      onButtonClick={handleComplete}
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
          <Text className="text-body-small text-gray-500 mb-1">
            {t('act.values.result.selectedValue')}
          </Text>
          <Text className="text-body-large font-bold text-blue-600">
            {data?.value}
          </Text>
        </div>
        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
          <Text className="text-body-small text-gray-500 mb-1">
            {t('act.values.result.reason')}
          </Text>
          <Text className="text-body-medium text-gray-700 break-words leading-relaxed">
            {data?.reason}
          </Text>
        </div>
        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
          <Text className="text-body-small text-gray-500 mb-1">
            {t('act.values.result.action')}
          </Text>
          <Text className="text-body-medium text-gray-700 break-words leading-relaxed">
            {data?.action}
          </Text>
        </div>
      </div>
    </ActResultPage>
  );
}
