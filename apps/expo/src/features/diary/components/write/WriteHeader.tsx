import { useColorScheme } from 'nativewind';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { NavButton, Text, View } from '@src/components/ui';

import { DAY_LABELS } from '../../constants';

interface WriteHeaderProps {
  onBack: () => void;
  onClose: () => void;
}

function getDateLabel(): string {
  const d = new Date();
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${DAY_LABELS[d.getDay()]}요일`;
}

export function WriteHeader({ onBack, onClose }: WriteHeaderProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

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
        {getDateLabel()}
      </Text>
      <NavButton
        variant="close"
        onPress={onClose}
      />
    </View>
  );
}
