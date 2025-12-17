import { API_KEY, QuotaResponse, chatAPI } from '@src/lib/api';
import { useQuery } from '@tanstack/react-query';

interface UseChatQuotaReturn {
  /** 남은 횟수 */
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
