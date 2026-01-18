'use client';

import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { Value } from '../hooks/useActionStep';

type ValueCircleProps = {
  selectedValue: Value;
  onSelectValue: (key: keyof Value, value: number) => void;
};

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

export default function ValueCircle({
  selectedValue,
  onSelectValue,
}: ValueCircleProps) {
  const { t } = useTranslation();

  // SVG 내부 좌표계는 100x100으로 고정
  const maxRadius = VIEWBOX_SIZE / 2; // 50
  const gameRadius = maxRadius - 8; // 꽉 채움
  const step = gameRadius / 3;

  const rings = [
    { inner: gameRadius - step, outer: gameRadius },
    { inner: gameRadius - step * 2, outer: gameRadius - step },
    { inner: 0, outer: gameRadius - step * 2 },
  ];

  const valueLabels = ['growth', 'leisure', 'work', 'relationship'];
  const quarters = [
    { start: -90, end: 0 },
    { start: 0, end: 90 },
    { start: 90, end: 180 },
    { start: 180, end: 270 },
  ];

  const domainLabels = [
    t('act.values.domain.relationship'),
    t('act.values.domain.growth'),
    t('act.values.domain.work'),
    t('act.values.domain.leisure'),
  ];

  const v = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];

  const sectors: {
    path: string;
    center: { x: number; y: number };
    ringIndex: number;
    value: number;
    key: string;
  }[] = [];
  rings.forEach((ring, rIdx) => {
    quarters.forEach((q, qIdx) => {
      sectors.push({
        path: createSectorPath(CX, CY, ring.inner, ring.outer, q.start, q.end),
        center: getSectorCenter(CX, CY, ring.inner, ring.outer, q.start, q.end),
        ringIndex: rIdx,
        value: v[rIdx * 4 + qIdx],
        key: valueLabels[qIdx],
      });
    });
  });

  return (
    <div className="w-full aspect-square relative">
      <div className="flex-1 flex flex-row justify-between items-center px-12">
        <Text className="text-label-medium font-bold text-slate-700   bg-blue-100 px-3 py-1 rounded-xl">
          {domainLabels[0]}
        </Text>
        <Text className="text-label-medium font-bold text-slate-700 bg-blue-100 px-3 py-1 rounded-xl">
          {domainLabels[1]}
        </Text>
      </div>

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      >
        {sectors.map((s) => {
          const isSelected = selectedValue[s.key as keyof Value] === s.value;
          const colors = RING_COLORS[s.ringIndex];
          return (
            <motion.g key={s.path}>
              <motion.path
                d={s.path}
                fill={isSelected ? colors.selected : colors.base}
                stroke="white"
                strokeWidth={0.5}
                onClick={() => onSelectValue(s.key as keyof Value, s.value)}
                initial={false}
                style={{ transformOrigin: '50px 50px', cursor: 'pointer' }}
                whileHover={{ opacity: 0.9 }}
              />
              <text
                x={s.center.x}
                y={s.center.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={4}
                fill={isSelected ? 'white' : '#1e3a5f'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {s.value}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="flex-1 flex flex-row justify-between items-center px-12">
        <Text className="text-label-medium font-bold text-slate-700 bg-blue-100 px-3 py-1 rounded-xl">
          {domainLabels[2]}
        </Text>
        <Text className="text-label-medium font-bold text-slate-700 bg-blue-100 px-3 py-1 rounded-xl">
          {domainLabels[3]}
        </Text>
      </div>
    </div>
  );
}
