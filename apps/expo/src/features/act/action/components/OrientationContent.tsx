import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text, View } from '@src/components/ui';

import { ACT_TEXT_INPUT_STYLE } from '../../constants';
import type { Value } from '../types';
import { DomainChip } from './DomainChip';

interface OrientationContentProps {
  title: string;
  description: string;
  domainLabel: string;
  lowestDomains: (keyof Value)[];
  selectedDomain: keyof Value;
  orientation: string;
  onSelectDomain: (domain: keyof Value) => void;
  onOrientationChange: (text: string) => void;
  placeholder: string;
}

export function OrientationContent({
  title,
  description,
  domainLabel,
  lowestDomains,
  selectedDomain,
  orientation,
  onSelectDomain,
  onOrientationChange,
  placeholder,
}: OrientationContentProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  return (
    <View className="flex-1 gap-4">
      {lowestDomains.length > 1 && (
        <View className="flex-row flex-wrap gap-2">
          {lowestDomains.map((domain) => (
            <DomainChip
              key={domain}
              isSelected={selectedDomain === domain}
              label={t(`act.values.domain.${domain}`)}
              onPress={() => onSelectDomain(domain)}
            />
          ))}
        </View>
      )}
      <View className="gap-2">
        <View className="flex-row flex-wrap items-center gap-2">
          <View className="rounded-xl bg-btn-act-page px-3 py-1">
            <Text
              preset="heading"
              bold
              className="text-inverse"
            >
              {domainLabel}
            </Text>
          </View>
          <Text
            preset="heading"
            bold
          >
            {title}
          </Text>
        </View>
        <Text
          preset="body"
          className="text-sub"
        >
          {description}
        </Text>
      </View>
      <TextInput
        value={orientation}
        onChangeText={onOrientationChange}
        placeholder={placeholder}
        placeholderTextColor={tokens['--act-input-placeholder']}
        multiline
        className="flex-1 rounded-2xl border border-white bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
        style={{
          ...ACT_TEXT_INPUT_STYLE,
          color: tokens['--text-primary'],
        }}
      />
    </View>
  );
}
