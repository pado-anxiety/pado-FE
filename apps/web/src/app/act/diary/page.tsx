'use client';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import ActIntroPage from '@/components/act/ActIntroPage/ActIntroPage';
import { handlePostMessage } from '@/lib/webview';

export default function DiaryPage() {
  const { t } = useTranslation();

  const handleStart = () => {
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
      title={t('act.diary.intro.title')}
      description={t('act.diary.intro.description', { returnObjects: true }) as string[]}
      contentTitle={t('act.diary.intro.contentTitle')}
      contentDescription={t('act.diary.intro.contentDescription')}
      steps={t('act.diary.intro.steps', { returnObjects: true }) as string[]}
      tipText={t('act.diary.intro.tip')}
      buttonText={t('common.button.start')}
      onStart={handleStart}
      onClose={handleClose}
    />
  );
}
