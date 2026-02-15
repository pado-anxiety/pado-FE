import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import type { Value } from '../types';

export const VIEWBOX_SIZE = 100;
export const CX = VIEWBOX_SIZE / 2;
export const CY = VIEWBOX_SIZE / 2;

export function createSectorPath(
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

export function getSectorCenter(
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

export const getRingColors = (
  tokens: typeof semanticColors.light,
  isDark: boolean,
) => {
  if (isDark) {
    // 바깥→안쪽으로 갈수록 밝아지는 링 (과녁 느낌)
    return [
      { base: '#252A34', selected: tokens['--btn-act-page-selected'] },
      { base: '#2A3140', selected: tokens['--btn-act-page-selected'] },
      { base: '#30394A', selected: tokens['--btn-act-page-selected'] },
    ];
  }
  return [
    {
      base: tokens['--btn-act-page-unselected'],
      selected: tokens['--btn-act-page-selected'],
    },
    {
      base: tokens['--btn-act-page-unselected'],
      selected: tokens['--btn-act-page-selected'],
    },
    {
      base: tokens['--btn-act-page-unselected'],
      selected: tokens['--btn-act-page-selected'],
    },
  ];
};

export const VALUE_LABELS: (keyof Value)[] = [
  'growth',
  'leisure',
  'work',
  'relationship',
];

export const QUARTERS = [
  { start: -90, end: 0 },
  { start: 0, end: 90 },
  { start: 90, end: 180 },
  { start: 180, end: 270 },
];
