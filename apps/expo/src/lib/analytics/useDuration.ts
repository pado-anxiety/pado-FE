import { useCallback, useEffect, useRef } from 'react';

/**
 * 스텝 체류 시간 측정 훅
 */
export const useDuration = () => {
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  /**
   * 현재까지의 체류 시간을 반환하고 타이머를 리셋
   * @returns 체류 시간 (초)
   */
  const getDuration = useCallback(() => {
    if (startTime.current === null) return 0;

    const endTime = Date.now();
    const result = Math.floor((endTime - startTime.current) / 1000);
    startTime.current = endTime;
    return result;
  }, []);

  /**
   * 타이머를 수동으로 리셋
   */
  const resetDuration = useCallback(() => {
    startTime.current = Date.now();
  }, []);

  return { getDuration, resetDuration };
};
