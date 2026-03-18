import React from 'react';

import { Canvas, DashPathEffect, Path, Skia } from '@shopify/react-native-skia';
import { useColorScheme } from 'nativewind';
import { scale } from 'react-native-size-matters';

import { getOceanColors } from '@src/lib/theme';

import { Point } from './types';

type ActPathProps = {
  points: Point[];
  height: number;
};

/** Curve tension range for X axis: random in [MIN, MIN + RANGE] */
const CURVE_TENSION_X_MIN = 0.3;
const CURVE_TENSION_X_RANGE = 0.5;
/** Curve tension range for Y axis: random in [MIN, MIN + RANGE] */
const CURVE_TENSION_Y_MIN = 0.4;
const CURVE_TENSION_Y_RANGE = 0.8;

const STROKE_WIDTH = 6;
const DASH_INTERVAL = 15;

function drawPath(points: Point[]) {
  const path = Skia.Path.Make();
  const keys = Object.keys(points)
    .map(Number)
    .sort((a, b) => a - b);

  if (keys.length > 1) {
    const p0 = points[keys[0]];
    path.moveTo(p0.x, p0.y);

    for (let i = 0; i < keys.length - 1; i++) {
      const start = points[keys[i]];
      const end = points[keys[i + 1]];

      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const curveTensionX = Math.random() * CURVE_TENSION_X_RANGE + CURVE_TENSION_X_MIN;
      const curveTensionY = Math.random() * CURVE_TENSION_Y_RANGE + CURVE_TENSION_Y_MIN;

      const cp1x = start.x - dx * curveTensionX;
      const cp2x = end.x + dx * curveTensionX;

      const cp1y = start.y + dy * curveTensionY;
      const cp2y = end.y - dy * curveTensionY;

      path.cubicTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
    }
  }

  return path;
}

export const ActPath = React.memo(function ActPath({ points, height }: ActPathProps): React.ReactNode {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const ocean = getOceanColors(scheme);

  return (
    <Canvas
      style={{
        width: '100%',
        height: height,
        position: 'absolute',
        inset: 0,
        backgroundColor: 'transparent',
      }}
    >
      <Path
        path={drawPath(points)}
        color={ocean.pathLine}
        style="stroke"
        strokeWidth={scale(STROKE_WIDTH)}
        strokeCap="round"
        strokeJoin="round"
      >
        <DashPathEffect intervals={[scale(DASH_INTERVAL), scale(DASH_INTERVAL)]} />
      </Path>
    </Canvas>
  );
});
