import { useCallback, useEffect, useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text } from '@src/components/ui';
import { hexToRgba } from '@src/lib/theme';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

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

function isToday(year: number, month: number, day: number): boolean {
  const now = new Date();
  return (
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day
  );
}

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
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goNext = useCallback(() => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  // Notify parent when month changes
  useEffect(() => {
    onMonthChange?.(viewYear, viewMonth + 1);
  }, [viewYear, viewMonth, onMonthChange]);

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
          marginBottom: 12,
        }}
      >
        <Pressable
          onPress={goPrev}
          hitSlop={12}
        >
          <Feather
            name="chevron-left"
            size={24}
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
          hitSlop={12}
        >
          <Feather
            name="chevron-right"
            size={24}
            color="rgba(255,255,255,0.7)"
          />
        </Pressable>
      </View>

      {/* Day labels */}
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {DAY_LABELS.map((label, i) => (
          <View
            key={label}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <Text
              preset="sub"
              style={{
                color:
                  i === 0
                    ? 'rgba(255,120,120,0.7)'
                    : i === 6
                      ? 'rgba(120,160,255,0.7)'
                      : 'rgba(255,255,255,0.5)',
              }}
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
                  style={{ flex: 1, height: 52 }}
                />
              );
            }

            const dateStr = formatDateString(viewYear, viewMonth, day);
            const today = isToday(viewYear, viewMonth, day);
            const hasEntry = markedDates.has(dateStr);
            const isSelected = selectedDate === dateStr;

            // Streak detection — check adjacent cells in same row
            const prevInRow =
              hasEntry &&
              di > 0 &&
              week[di - 1] !== null &&
              markedDates.has(
                formatDateString(viewYear, viewMonth, week[di - 1]!),
              );
            const nextInRow =
              hasEntry &&
              di < 6 &&
              week[di + 1] !== null &&
              markedDates.has(
                formatDateString(viewYear, viewMonth, week[di + 1]!),
              );

            return (
              <Pressable
                key={day}
                onPress={() => onDatePress(dateStr)}
                style={{
                  flex: 1,
                  height: 52,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Streak tint background */}
                {hasEntry && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 6,
                      bottom: 10,
                      left: prevInRow ? 0 : 4,
                      right: nextInRow ? 0 : 4,
                      // backgroundColor: hexToRgba(accent, 0.1),
                      borderTopLeftRadius: prevInRow ? 0 : 10,
                      borderBottomLeftRadius: prevInRow ? 0 : 10,
                      borderTopRightRadius: nextInRow ? 0 : 10,
                      borderBottomRightRadius: nextInRow ? 0 : 10,
                    }}
                  />
                )}

                {/* Today highlight — square border like selected, transparent fill */}
                {today && (
                  <View
                    style={{
                      position: 'absolute',
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      borderWidth: 1.5,
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
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      borderWidth: 1.5,
                      borderColor: hexToRgba(accent, 0.8),
                      backgroundColor: hexToRgba(accent, 0.25),
                    }}
                  />
                )}

                <Text
                  preset="body"
                  style={{
                    color: today
                      ? '#fff'
                      : isSelected
                        ? '#fff'
                        : hasEntry
                          ? '#fff'
                          : 'rgba(255,255,255,0.8)',
                    fontFamily:
                      today || hasEntry || isSelected
                        ? 'Pretendard-SemiBold'
                        : 'Pretendard-Regular',
                  }}
                >
                  {day}
                </Text>

                {/* Dot — hide when today or selected */}
                {hasEntry && !today && !isSelected && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 5,
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: accent,
                    }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
