import { useCallback } from 'react';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, View } from '@src/components/ui';
import { PageType } from '@src/features/home/types';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';
import { PAGE_TRANSITION } from '@src/lib/styles';

import { useDiaryEntries } from '../../hooks/useDiaryEntries';
import { Calendar } from './Calendar';
import { CalendarHeader } from './CalendarHeader';
import { DiaryEntryDetail } from './DiaryEntryDetail';

interface DiaryCalendarSectionProps {
  setPage: (page: PageType) => void;
}

export function DiaryCalendarSection({ setPage }: DiaryCalendarSectionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const {
    markedDates,
    selectedDate,
    detailList,
    detailLoading,
    handleDatePress,
    handleMonthChange,
  } = useDiaryEntries();

  const handleWrite = useCallback(() => {
    triggerHaptic('NAVIGATE');
    router.push(ROUTES.DIARY);
  }, [router]);

  const handleBack = useCallback(() => {
    triggerHaptic('NAVIGATE');
    setPage('HOME');
  }, [setPage]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill]}
      entering={PAGE_TRANSITION.entering}
      exiting={PAGE_TRANSITION.exiting}
    >
      <View
        className="flex-1"
        style={{ paddingTop: insets.top + 12 }}
      >
        <CalendarHeader onBack={handleBack} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: insets.bottom + 24,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title — scrolls with content */}
          <View style={{ gap: 4 }}>
            <Text
              preset="title"
              bold
              style={{ color: '#fff' }}
            >
              {t('diary.title')}
            </Text>
            <Text
              preset="sub"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {t('diary.subtitle')}
            </Text>
          </View>

          {/* Calendar */}
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
              marginBottom: 16,
            }}
          >
            <Calendar
              markedDates={markedDates}
              selectedDate={selectedDate}
              onDatePress={handleDatePress}
              onMonthChange={handleMonthChange}
            />
          </View>

          {/* Diary entries */}
          {selectedDate && (
            <DiaryEntryDetail
              date={selectedDate}
              entries={detailList}
              loading={detailLoading}
              onWrite={handleWrite}
            />
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
}
