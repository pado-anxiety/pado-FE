import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text, View } from '@src/components/ui';

import type { Value } from '../types';
import {
  CX,
  CY,
  QUARTERS,
  VALUE_LABELS,
  VIEWBOX_SIZE,
  createSectorPath,
  getRingColors,
  getSectorCenter,
} from './value-circle-utils';

interface ValueCircleProps {
  selectedValue: Value;
  onSelectValue: (key: keyof Value, value: number) => void;
}

export function ValueCircle({
  selectedValue,
  onSelectValue,
}: ValueCircleProps) {
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const isDark = colorScheme === 'dark';
  const RING_COLORS = getRingColors(tokens, isDark);
  const { width } = useWindowDimensions();
  const circleSize = width * 0.9;
  const labelMinWidth = i18n.language === 'ko' ? 80 : 140;

  const maxRadius = VIEWBOX_SIZE / 2;
  const gameRadius = maxRadius - 8;
  const step = gameRadius / 3;

  const rings = [
    { inner: gameRadius - step, outer: gameRadius },
    { inner: gameRadius - step * 2, outer: gameRadius - step },
    { inner: 0, outer: gameRadius - step * 2 },
  ];

  const domainLabels = [
    t('act.values.domain.relationship'),
    t('act.values.domain.growth'),
    t('act.values.domain.work'),
    t('act.values.domain.leisure'),
  ];

  const ringValues = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];

  const sectors: {
    path: string;
    center: { x: number; y: number };
    ringIndex: number;
    value: number;
    key: keyof Value;
  }[] = [];

  rings.forEach((ring, rIdx) => {
    QUARTERS.forEach((q, qIdx) => {
      sectors.push({
        path: createSectorPath(CX, CY, ring.inner, ring.outer, q.start, q.end),
        center: getSectorCenter(CX, CY, ring.inner, ring.outer, q.start, q.end),
        ringIndex: rIdx,
        value: ringValues[rIdx * 4 + qIdx],
        key: VALUE_LABELS[qIdx],
      });
    });
  });

  return (
    <View className="items-center">
      {/* Top labels */}
      <View className="w-full flex-row justify-between">
        <View
          className="items-center rounded-xl bg-act-input px-3 py-1"
          style={{ minWidth: labelMinWidth }}
        >
          <Text
            preset="heading"
            bold
            className="text-sub"
          >
            {domainLabels[0]}
          </Text>
        </View>
        <View
          className="items-center rounded-xl bg-act-input px-3 py-1"
          style={{ minWidth: labelMinWidth }}
        >
          <Text
            preset="heading"
            bold
            className="text-sub"
          >
            {domainLabels[1]}
          </Text>
        </View>
      </View>

      {/* SVG circle */}
      <Svg
        width={circleSize}
        height={circleSize}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      >
        {sectors.map((s) => {
          const isSelected = selectedValue[s.key] === s.value;
          const colors = RING_COLORS[s.ringIndex];
          return (
            <G key={`${s.key}-${s.value}`}>
              <Path
                d={s.path}
                fill={isSelected ? colors.selected : colors.base}
                stroke={
                  isDark ? 'rgba(255,255,255,0.1)' : tokens['--bg-surface']
                }
                strokeWidth={0.5}
                onPress={() => onSelectValue(s.key, s.value)}
              />
              <SvgText
                x={s.center.x}
                y={s.center.y}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={4}
                fill={
                  isSelected
                    ? tokens['--text-inverse']
                    : tokens['--text-primary']
                }
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {s.value}
              </SvgText>
            </G>
          );
        })}
      </Svg>

      {/* Bottom labels */}
      <View className="w-full flex-row justify-between">
        <View
          className="items-center rounded-xl bg-act-input px-3 py-1"
          style={{ minWidth: labelMinWidth }}
        >
          <Text
            preset="heading"
            bold
            className="text-sub"
          >
            {domainLabels[2]}
          </Text>
        </View>
        <View
          className="items-center rounded-xl bg-act-input px-3 py-1"
          style={{ minWidth: labelMinWidth }}
        >
          <Text
            preset="heading"
            bold
            className="text-sub"
          >
            {domainLabels[3]}
          </Text>
        </View>
      </View>
    </View>
  );
}
