import { useQuery } from '@tanstack/react-query';

import { API_KEY, QuotaResponse, chatAPI } from '@src/lib/api';

interface UseChatQuotaReturn {
  remainingQuota: QuotaResponse | undefined;
}

export function useChatQuota(): UseChatQuotaReturn {
  const { data: remainingQuota } = useQuery({
    queryKey: [API_KEY.QUOTA],
    queryFn: () => chatAPI.getRemainingQuota(),
  });

  return {
    remainingQuota,
  };
}
