import { useCallback, useMemo, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { diaryAPI, DiaryDetail } from '@src/lib/api/diary';
import { triggerHaptic } from '@src/lib/haptics';

function getTodayStr() {
  return new Date().toISOString().substring(0, 10);
}

const DIARY_MONTHLY_KEY = 'diary-monthly';
const DIARY_DETAILS_KEY = 'diary-details';

export function useDiaryEntries() {
  const queryClient = useQueryClient();
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayStr(),
  );

  // Monthly entries via useQuery
  const { data: monthlyEntries = [] } = useQuery({
    queryKey: [DIARY_MONTHLY_KEY, viewYear, viewMonth],
    queryFn: () => diaryAPI.getMonthly(viewYear, viewMonth),
  });

  // Entries for selected date
  const selectedDateEntries = useMemo(() => {
    if (!selectedDate) return [];
    return monthlyEntries.filter((e) => e.time.startsWith(selectedDate));
  }, [monthlyEntries, selectedDate]);

  // Stable key for selected date entry IDs
  const selectedEntryIds = useMemo(
    () => selectedDateEntries.map((e) => e.id).join(','),
    [selectedDateEntries],
  );

  // Fetch details declaratively via useQuery instead of useEffect+setState
  const { data: detailList = [], isLoading: detailLoading } = useQuery({
    queryKey: [DIARY_DETAILS_KEY, selectedDate, selectedEntryIds],
    queryFn: async () => {
      const results = await Promise.all(
        selectedDateEntries.map((e) =>
          diaryAPI.getDetail(e.id).catch(() => null),
        ),
      );
      return results.filter(Boolean) as DiaryDetail[];
    },
    enabled: !!selectedDate && selectedDateEntries.length > 0,
  });

  const markedDates = useMemo(() => {
    const dates = new Set<string>();
    monthlyEntries.forEach((entry) => {
      dates.add(entry.time.substring(0, 10));
    });
    return dates;
  }, [monthlyEntries]);

  const handleDatePress = useCallback(
    (dateString: string) => {
      triggerHaptic('SELECT');
      if (selectedDate === dateString) {
        setSelectedDate(null);
        return;
      }
      setSelectedDate(dateString);
    },
    [selectedDate],
  );

  const handleMonthChange = useCallback((year: number, month: number) => {
    setViewYear(year);
    setViewMonth(month);
    setSelectedDate(null);
  }, []);

  /** 일기 작성 후 호출 — 월별 목록 + 상세 모두 갱신 */
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [DIARY_MONTHLY_KEY] });
    queryClient.invalidateQueries({ queryKey: [DIARY_DETAILS_KEY] });
  }, [queryClient]);

  return {
    markedDates,
    selectedDate,
    detailList,
    detailLoading,
    hasEntries: selectedDateEntries.length > 0,
    handleDatePress,
    handleMonthChange,
    invalidate,
  };
}
