import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ACTType, ActHistory } from '@src/features/history/types';
import { showAlert } from '@src/lib/alert';
import { historyAPI } from '@src/lib/api/history';

export function useHistoryDetailModal() {
  const { t } = useTranslation();
  const [modalType, setModalType] = useState<{
    type: ACTType;
    date: string;
  } | null>(null);
  const [detail, setDetail] = useState<ActHistory | null>(null);

  const detailMutation = useMutation({
    mutationFn: historyAPI.getDetail,
    onSuccess: (data) => setDetail(data),
    onError: () =>
      showAlert.error(t('common.error.generic'), t('common.error.tryLater')),
  });

  const handleModalOpen = (id: string, type: ACTType, date: string) => {
    detailMutation.mutate(id);
    setModalType({ type, date });
  };

  const handleModalClose = () => {
    setModalType(null);
    setDetail(null);
  };

  return { modalType, detail, handleModalOpen, handleModalClose };
}
