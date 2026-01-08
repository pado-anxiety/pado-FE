import {
  Canvas,
  DashPathEffect,
  Fill,
  LinearGradient,
  Path,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { scale } from 'react-native-size-matters';

import { Point } from './types';

type ActPathProps = {
  points: Point[];
  height: number;
};

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

      const curveTensionX = Math.random() * 0.5 + 0.3;
      const curveTensionY = Math.random() * 0.8 + 0.4;

      const cp1x = start.x - dx * curveTensionX;
      const cp2x = end.x + dx * curveTensionX;

      const cp1y = start.y + dy * curveTensionY;
      const cp2y = end.y - dy * curveTensionY;

      path.cubicTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
    }
  }

  return path;
}

export function ActPath({ points, height }: ActPathProps): React.ReactNode {
  return (
    <Canvas
      style={{
        width: '100%',
        height: height,
        position: 'absolute',
        inset: 0,
        backgroundColor: '#010C1E',
      }}
    >
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}
          colors={['#003366', '#010C1E']}
        />
      </Fill>
      <Path
        path={drawPath(points)}
        color="white"
        style="stroke"
        strokeWidth={scale(6)}
        strokeCap="round"
        strokeJoin="round"
      >
        <DashPathEffect intervals={[scale(15), scale(15)]} />
      </Path>
    </Canvas>
  );
}
