import { useEffect, useRef } from 'react';

export const useDuration = () => {
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = new Date().getTime();
  }, []);

  const getDuration = () => {
    if (startTime.current === null) return 0;

    const endTime = new Date().getTime();
    const result = Math.floor((endTime - startTime.current) / 1000);
    startTime.current = endTime;
    return result;
  };

  return { getDuration };
};
