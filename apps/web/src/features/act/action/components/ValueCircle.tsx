'use client';

import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

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
  { base: 'transparent', selected: 'transparent' },
  { base: '#93c5fd', selected: '#005599' },
  { base: '#60a5fa', selected: '#005599' },
  { base: '#3b82f6', selected: '#005599' },
];

export default function ValueCircle({
  selectedValue,
  onSelectValue,
}: ValueCircleProps) {
  const { t } = useTranslation();
  const maxRadius = VIEWBOX_SIZE / 2;
  const textRingWidth = 8;
  const gameRadius = maxRadius - textRingWidth;
  const step = gameRadius / 3;

  const rings = [
    { inner: gameRadius, outer: maxRadius },
    { inner: gameRadius - step, outer: gameRadius },
    { inner: gameRadius - step * 2, outer: gameRadius - step },
    { inner: 0, outer: gameRadius - step * 2 },
  ];

  const valueLabels = ['work', 'growth', 'leisure', 'relationship'];
  const quarters = [
    { start: -90, end: 0 },
    { start: 0, end: 90 },
    { start: 90, end: 180 },
    { start: 180, end: 270 },
  ];

  const domainLabels = [
    t('act.values.domain.work'),
    t('act.values.domain.growth'),
    t('act.values.domain.leisure'),
    t('act.values.domain.relationship'),
  ];

  const v = [
    domainLabels[0],
    domainLabels[1],
    domainLabels[2],
    domainLabels[3],
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
  ];

  const sectors: {
    path: string;
    center: { x: number; y: number };
    ringIndex: number;
    value: number;
    key: string;
  }[] = [];
  rings.forEach((ring, rIdx) => {
    quarters.forEach((q, qIdx) => {
      const idx = rIdx * 4 + qIdx;
      sectors.push({
        path: createSectorPath(CX, CY, ring.inner, ring.outer, q.start, q.end),
        center: getSectorCenter(CX, CY, ring.inner, ring.outer, q.start, q.end),
        ringIndex: rIdx,
        value: v[idx] as number,
        key: valueLabels[qIdx],
      });
    });
  });

  return (
    <div className="w-full aspect-square relative">
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
                strokeWidth={s.ringIndex === 0 ? 0 : 0.5}
                onClick={() =>
                  s.ringIndex !== 0 &&
                  onSelectValue(s.key as keyof Value, s.value)
                }
                initial={false}
                style={{ transformOrigin: '50px 50px', cursor: 'pointer' }}
              />
              <text
                x={s.center.x}
                y={s.center.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={s.ringIndex === 0 ? 4 : 4}
                fill={isSelected ? 'white' : '#1e3a5f'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {typeof s.value === 'string' ? s.value : s.value}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
