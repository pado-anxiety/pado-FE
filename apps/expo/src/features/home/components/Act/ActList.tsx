import { useRef, useState } from 'react';

import { Canvas, DashPathEffect, Path, Skia } from '@shopify/react-native-skia';
import { View } from '@src/components/ui';
import { scale } from 'react-native-size-matters';

import { ACT_MENU_LIST } from '../../constants';
import { ActStep } from './ActStep';

export const BubbleSize = scale(80);

export type Point = {
  x: number;
  y: number;
};

export function ActList(): React.ReactNode {
  const containerRef = useRef<View>(null);
  const [points, setPoints] = useState<Point[]>([]);

  const drawPath = () => {
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

        const curveTensionX = Math.random() * 0.5 + 0.22;
        const curveTensionY = Math.random() * 0.8 + 0.22;

        const cp1x = start.x - dx * curveTensionX;
        const cp2x = end.x + dx * curveTensionX;

        const cp1y = start.y + dy * curveTensionY;
        const cp2y = end.y - dy * curveTensionY;

        path.cubicTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
      }
    }
    return path;
  };

  return (
    <View
      ref={containerRef}
      className="flex-1 w-full relative pb-24"
    >
      <Canvas
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      >
        <Path
          path={drawPath()}
          color="white"
          style="stroke"
          strokeWidth={scale(6)}
          strokeCap="round"
          strokeJoin="round"
        >
          <DashPathEffect intervals={[20, 20]} />
        </Path>
      </Canvas>
      <View className="flex-1 flex-col gap-24 items-center w-full">
        {ACT_MENU_LIST.map((item, index) => (
          <ActStep
            key={index}
            item={item}
            index={index}
            containerRef={containerRef}
            onReportLayout={(point: Point) => {
              setPoints((prev) => ({ ...prev, [index]: point }));
            }}
          />
        ))}
      </View>
    </View>
  );
}
