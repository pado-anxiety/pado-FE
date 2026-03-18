import { memo, useCallback, useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text } from '@src/components/ui';
import { hexToRgba } from '@src/lib/theme';

import { DAY_LABELS } from '../../constants';

const CALENDAR = {
  CELL_HEIGHT: 52,
  SELECTED_SIZE: 36,
  SELECTED_RADIUS: 8,
  SELECTED_BORDER_WIDTH: 1.5,
  DOT_SIZE: 4,
  DOT_BOTTOM: 5,
  STREAK_INSET: 4,
  STREAK_RADIUS: 10,
  STREAK_TOP: 6,
  STREAK_BOTTOM: 10,
  MONTH_NAV_MARGIN_BOTTOM: 12,
  DAY_LABELS_MARGIN_BOTTOM: 4,
  NAV_ICON_SIZE: 24,
  NAV_HIT_SLOP: 12,
} as const;

interface CalendarProps {
  markedDates: Set<string>;
  selectedDate?: string | null;
  onDatePress: (dateString: string) => void;
  onMonthChange?: (year: number, month: number) => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateString(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function checkIsToday(year: number, month: number, day: number): boolean {
  const now = new Date();
  return (
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day
  );
}

function getDayLabelColor(dayIndex: number): string {
  if (dayIndex === 0) return 'rgba(255,120,120,0.7)';
  if (dayIndex === 6) return 'rgba(120,160,255,0.7)';
  return 'rgba(255,255,255,0.5)';
}

function getDayTextStyle(
  today: boolean,
  isSelected: boolean,
  hasEntry: boolean,
): { color: string; fontFamily: string } {
  const isBold = today || isSelected || hasEntry;
  return {
    color: today || isSelected || hasEntry ? '#fff' : 'rgba(255,255,255,0.8)',
    fontFamily: isBold ? 'Pretendard-SemiBold' : 'Pretendard-Regular',
  };
}

interface CalendarDayCellProps {
  day: number;
  viewYear: number;
  viewMonth: number;
  markedDates: Set<string>;
  selectedDate?: string | null;
  accent: string;
  week: (number | null)[];
  dayIndex: number;
  onDatePress: (dateString: string) => void;
}

const CalendarDayCell = memo(function CalendarDayCell({
  day,
  viewYear,
  viewMonth,
  markedDates,
  selectedDate,
  accent,
  week,
  dayIndex,
  onDatePress,
}: CalendarDayCellProps) {
  const dateStr = formatDateString(viewYear, viewMonth, day);
  const today = checkIsToday(viewYear, viewMonth, day);
  const hasEntry = markedDates.has(dateStr);
  const isSelected = selectedDate === dateStr;

  // Streak detection — check adjacent cells in same row
  const prevInRow =
    hasEntry &&
    dayIndex > 0 &&
    week[dayIndex - 1] !== null &&
    markedDates.has(
      formatDateString(viewYear, viewMonth, week[dayIndex - 1]!),
    );
  const nextInRow =
    hasEntry &&
    dayIndex < 6 &&
    week[dayIndex + 1] !== null &&
    markedDates.has(
      formatDateString(viewYear, viewMonth, week[dayIndex + 1]!),
    );

  const textStyle = getDayTextStyle(today, isSelected, hasEntry);

  return (
    <Pressable
      onPress={() => onDatePress(dateStr)}
      style={{
        flex: 1,
        height: CALENDAR.CELL_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Streak tint background */}
      {hasEntry && (
        <View
          style={{
            position: 'absolute',
            top: CALENDAR.STREAK_TOP,
            bottom: CALENDAR.STREAK_BOTTOM,
            left: prevInRow ? 0 : CALENDAR.STREAK_INSET,
            right: nextInRow ? 0 : CALENDAR.STREAK_INSET,
            borderTopLeftRadius: prevInRow ? 0 : CALENDAR.STREAK_RADIUS,
            borderBottomLeftRadius: prevInRow ? 0 : CALENDAR.STREAK_RADIUS,
            borderTopRightRadius: nextInRow ? 0 : CALENDAR.STREAK_RADIUS,
            borderBottomRightRadius: nextInRow ? 0 : CALENDAR.STREAK_RADIUS,
          }}
        />
      )}

      {/* Today highlight */}
      {today && (
        <View
          style={{
            position: 'absolute',
            width: CALENDAR.SELECTED_SIZE,
            height: CALENDAR.SELECTED_SIZE,
            borderRadius: CALENDAR.SELECTED_RADIUS,
            borderWidth: CALENDAR.SELECTED_BORDER_WIDTH,
            borderColor: 'rgba(255,255,255,0.3)',
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}
        />
      )}

      {/* Selected — square border */}
      {isSelected && !today && (
        <View
          style={{
            position: 'absolute',
            width: CALENDAR.SELECTED_SIZE,
            height: CALENDAR.SELECTED_SIZE,
            borderRadius: CALENDAR.SELECTED_RADIUS,
            borderWidth: CALENDAR.SELECTED_BORDER_WIDTH,
            borderColor: hexToRgba(accent, 0.8),
            backgroundColor: hexToRgba(accent, 0.25),
          }}
        />
      )}

      <Text
        preset="body"
        style={textStyle}
      >
        {day}
      </Text>

      {/* Dot — hide when today or selected */}
      {hasEntry && !today && !isSelected && (
        <View
          style={{
            position: 'absolute',
            bottom: CALENDAR.DOT_BOTTOM,
            width: CALENDAR.DOT_SIZE,
            height: CALENDAR.DOT_SIZE,
            borderRadius: CALENDAR.DOT_SIZE / 2,
            backgroundColor: accent,
          }}
        />
      )}
    </Pressable>
  );
});

export function Calendar({
  markedDates,
  selectedDate,
  onDatePress,
  onMonthChange,
}: CalendarProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const accent = tokens['--btn-act-page'];

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const goPrev = useCallback(() => {
    setViewMonth((prev) => {
      let newMonth: number;
      if (prev === 0) {
        setViewYear((y) => {
          const newYear = y - 1;
          onMonthChange?.(newYear, 12);
          return newYear;
        });
        newMonth = 11;
      } else {
        newMonth = prev - 1;
        // Use current viewYear since it hasn't changed
        setViewYear((y) => {
          onMonthChange?.(y, newMonth + 1);
          return y;
        });
      }
      return newMonth;
    });
  }, [onMonthChange]);

  const goNext = useCallback(() => {
    setViewMonth((prev) => {
      let newMonth: number;
      if (prev === 11) {
        setViewYear((y) => {
          const newYear = y + 1;
          onMonthChange?.(newYear, 1);
          return newYear;
        });
        newMonth = 0;
      } else {
        newMonth = prev + 1;
        setViewYear((y) => {
          onMonthChange?.(y, newMonth + 1);
          return y;
        });
      }
      return newMonth;
    });
  }, [onMonthChange]);

  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const monthLabel = `${viewYear}년 ${viewMonth + 1}월`;

  return (
    <View>
      {/* Month navigation */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: CALENDAR.MONTH_NAV_MARGIN_BOTTOM,
        }}
      >
        <Pressable
          onPress={goPrev}
          hitSlop={CALENDAR.NAV_HIT_SLOP}
        >
          <Feather
            name="chevron-left"
            size={CALENDAR.NAV_ICON_SIZE}
            color="rgba(255,255,255,0.7)"
          />
        </Pressable>
        <Text
          preset="body"
          bold
          style={{ color: '#fff' }}
        >
          {monthLabel}
        </Text>
        <Pressable
          onPress={goNext}
          hitSlop={CALENDAR.NAV_HIT_SLOP}
        >
          <Feather
            name="chevron-right"
            size={CALENDAR.NAV_ICON_SIZE}
            color="rgba(255,255,255,0.7)"
          />
        </Pressable>
      </View>

      {/* Day labels */}
      <View style={{ flexDirection: 'row', marginBottom: CALENDAR.DAY_LABELS_MARGIN_BOTTOM }}>
        {DAY_LABELS.map((label, i) => (
          <View
            key={label}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <Text
              preset="sub"
              style={{ color: getDayLabelColor(i) }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, wi) => (
        <View
          key={wi}
          style={{ flexDirection: 'row' }}
        >
          {week.map((day, di) => {
            if (day === null) {
              return (
                <View
                  key={`empty-${di}`}
                  style={{ flex: 1, height: CALENDAR.CELL_HEIGHT }}
                />
              );
            }

            return (
              <CalendarDayCell
                key={day}
                day={day}
                viewYear={viewYear}
                viewMonth={viewMonth}
                markedDates={markedDates}
                selectedDate={selectedDate}
                accent={accent}
                week={week}
                dayIndex={di}
                onDatePress={onDatePress}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
