import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { NavButton, Text, View } from '@src/components/ui';

interface WriteHeaderProps {
  onBack: () => void;
  onClose: () => void;
}

export function WriteHeader({ onBack, onClose }: WriteHeaderProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = t(`diary.calendar.days.${d.getDay()}`);
  const monthName = t(`diary.calendar.months.${d.getMonth()}`);

  const dateLabel = t('diary.calendar.dateLabelWithDay', {
    month,
    day,
    dayName,
    monthName,
  });

  return (
    <View className="flex-row items-center px-6">
      <View style={{ marginLeft: -6 }}>
        <NavButton
          variant="back"
          onPress={onBack}
        />
      </View>
      <Text
        preset="heading"
        style={{
          flex: 1,
          color: tokens['--text-secondary'],
          marginLeft: 4,
          fontFamily: 'Pretendard-SemiBold',
        }}
      >
        {dateLabel}
      </Text>
      <NavButton
        variant="close"
        onPress={onClose}
      />
    </View>
  );
}
