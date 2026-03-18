import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Button, Divider, Text, View } from '@src/components/ui';
import { DiaryDetail } from '@src/lib/api/diary';

function formatDisplayDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${parseInt(month)}월 ${parseInt(day)}일`;
}

function isTodayDate(dateStr: string): boolean {
  return dateStr === new Date().toISOString().substring(0, 10);
}

interface DiaryEntryDetailProps {
  date: string;
  entries: DiaryDetail[];
  loading: boolean;
  onWrite: () => void;
}

function DiaryEntryCard({ data, index }: { data: DiaryDetail; index: number }) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 12 }}>
      {index > 0 && (
        <View style={{ marginVertical: 8 }}>
          <Divider />
        </View>
      )}
      {[
        { label: t('diary.write.situation.badge'), value: data.situation },
        { label: t('diary.write.thought.badge'), value: data.thoughts },
        {
          label: t('diary.write.emotion.badge'),
          value: data.feelings.join(', '),
        },
      ].map((item) => (
        <View
          key={item.label}
          style={{ gap: 4 }}
        >
          <Text
            preset="sub"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {item.label}
          </Text>
          <Text
            preset="body"
            style={{ color: '#fff', lineHeight: 24 }}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function DiaryEntryDetail({
  date,
  entries,
  loading,
  onWrite,
}: DiaryEntryDetailProps) {
  const { t } = useTranslation();
  const isToday = isTodayDate(date);
  const displayDate = formatDisplayDate(date);

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={{ gap: 16 }}
    >
      <Text
        preset="heading"
        bold
        style={{ color: '#fff' }}
      >
        {displayDate}
      </Text>

      {(() => {
        if (loading) {
          return (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ paddingVertical: 16 }}
            />
          );
        }
        if (entries.length > 0) {
          return (
            <View style={{ gap: 20 }}>
              {entries.map((entry, i) => (
                <DiaryEntryCard
                  key={i}
                  data={entry}
                  index={i}
                />
              ))}
            </View>
          );
        }
        if (!isToday) {
          return (
            <Text
              preset="sub"
              style={{ color: 'rgba(255,255,255,0.4)', paddingVertical: 12 }}
            >
              {t('diary.calendar.noEntry')}
            </Text>
          );
        }
        return null;
      })()}

      {isToday && (
        <Button
          onPress={onWrite}
          className="mt-6 bg-btn-act-page"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialIcons
              name="edit"
              size={18}
              color="#fff"
            />
            <Text
              preset="body"
              bold
              style={{ color: '#fff' }}
            >
              {t('diary.calendar.write')}
            </Text>
          </View>
        </Button>
      )}
    </Animated.View>
  );
}
