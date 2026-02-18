import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { ActRecommendResponse, chatAPI } from '@src/lib/api';

interface UseActRecommendReturn {
  data: ActRecommendResponse | null;
  isLoading: boolean;
  isVisible: boolean;
  request: () => void;
  dismiss: () => void;
}

export function useActRecommend(): UseActRecommendReturn {
  const [isVisible, setIsVisible] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const [result] = await Promise.all([
        chatAPI.getActRecommend(),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
      return result;
    },
    onSuccess: () => {
      setIsVisible(true);
    },
  });

  const request = () => {
    mutation.mutate();
  };

  const dismiss = () => {
    setIsVisible(false);
  };

  return {
    data: mutation.data ?? null,
    isLoading: mutation.isPending,
    isVisible,
    request,
    dismiss,
  };
}
