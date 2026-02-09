import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { AnimatedText, NavButton, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';

export default function HistorySkySection({
  setPage,
}: {
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT') => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex flex-col items-start justify-center gap-4 bg-page px-8"
      style={{ paddingTop: insets.top }}
    >
      <View className="relative w-full">
        <View className="absolute left-[-8px]">
          <NavButton
            variant="back"
            size="large"
            onPress={() => {
              triggerHaptic('NAVIGATE');
              setPage('HOME');
            }}
          />
        </View>
      </View>
      <View
        className="flex flex-col gap-2 "
        style={{ paddingTop: scale(80) }}
      >
        <AnimatedText
          delay={1000}
          preset="title"
          bold
        >
          {t('act.common.history.title')}
        </AnimatedText>
        <AnimatedText
          delay={1500}
          preset="heading"
        >
          {t('act.common.history.subtitle')}
        </AnimatedText>
      </View>
    </View>
  );
}
