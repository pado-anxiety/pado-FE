import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

import { Text, View } from '@src/components/ui';

import type { Value } from '../types';

interface ValueCircleProps {
  selectedValue: Value;
  onSelectValue: (key: keyof Value, value: number) => void;
}

const VIEWBOX_SIZE = 100;
const CX = VIEWBOX_SIZE / 2;
const CY = VIEWBOX_SIZE / 2;

function createSectorPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  const p = (r: number, rad: number) => ({
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  });
  const p1 = p(outerRadius, startRad);
  const p2 = p(outerRadius, endRad);
  const p3 = p(innerRadius, endRad);
  const p4 = p(innerRadius, startRad);
  return `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;
}

function getSectorCenter(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
  const midRadius = (innerRadius + outerRadius) / 2;
  return {
    x: cx + midRadius * Math.cos(midAngle),
    y: cy + midRadius * Math.sin(midAngle),
  };
}

const RING_COLORS = [
  { base: '#93c5fd', selected: '#005599' },
  { base: '#60a5fa', selected: '#005599' },
  { base: '#3b82f6', selected: '#005599' },
];

const VALUE_LABELS: (keyof Value)[] = [
  'growth',
  'leisure',
  'work',
  'relationship',
];

const QUARTERS = [
  { start: -90, end: 0 },
  { start: 0, end: 90 },
  { start: 90, end: 180 },
  { start: 180, end: 270 },
];

export function ValueCircle({
  selectedValue,
  onSelectValue,
}: ValueCircleProps) {
  const { t, i18n } = useTranslation();
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
          className="items-center rounded-xl bg-blue-50 px-3 py-1"
          style={{ minWidth: labelMinWidth }}
        >
          <Text
            preset="heading"
            bold
            className="text-slate-700"
          >
            {domainLabels[0]}
          </Text>
        </View>
        <View
          className="items-center rounded-xl bg-blue-50 px-3 py-1"
          style={{ minWidth: labelMinWidth }}
        >
          <Text
            preset="heading"
            bold
            className="text-slate-700"
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
                stroke="white"
                strokeWidth={0.5}
                onPress={() => onSelectValue(s.key, s.value)}
              />
              <SvgText
                x={s.center.x}
                y={s.center.y}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={4}
                fill={isSelected ? 'white' : '#1e3a5f'}
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
          className="items-center rounded-xl bg-blue-50 px-3 py-1"
          style={{ minWidth: labelMinWidth }}
        >
          <Text
            preset="heading"
            bold
            className="text-slate-700"
          >
            {domainLabels[2]}
          </Text>
        </View>
        <View
          className="items-center rounded-xl bg-blue-50 px-3 py-1"
          style={{ minWidth: labelMinWidth }}
        >
          <Text
            preset="heading"
            bold
            className="text-slate-700"
          >
            {domainLabels[3]}
          </Text>
        </View>
      </View>
    </View>
  );
}
