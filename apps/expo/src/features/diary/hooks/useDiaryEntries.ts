import { useCallback, useEffect, useMemo, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { diaryAPI, DiaryDetail } from '@src/lib/api/diary';
import { triggerHaptic } from '@src/lib/haptics';

function getTodayStr() {
  return new Date().toISOString().substring(0, 10);
}

const DIARY_MONTHLY_KEY = 'diary-monthly';

export function useDiaryEntries() {
  const queryClient = useQueryClient();
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayStr(),
  );
  const [detailList, setDetailList] = useState<DiaryDetail[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

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

  // Fetch details for selected date entries
  useEffect(() => {
    if (!selectedDate || selectedDateEntries.length === 0) {
      setDetailList([]);
      setDetailLoading(false);
      return;
    }

    setDetailList([]);
    setDetailLoading(true);

    Promise.all(
      selectedDateEntries.map((e) =>
        diaryAPI.getDetail(e.id).catch(() => null),
      ),
    ).then((results) => {
      setDetailList(results.filter(Boolean) as DiaryDetail[]);
      setDetailLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedEntryIds]);

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
