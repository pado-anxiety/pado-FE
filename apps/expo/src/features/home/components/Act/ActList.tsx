import { useRef, useState } from 'react';

import { View } from '@src/components/ui';

import { ACT_MENU_LIST } from '../../constants';
import { ActPath } from './ActPath';
import { ActStep } from './ActStep';
import { Point } from './types';

export function ActList(): React.ReactNode {
  const containerRef = useRef<View>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [height, setHeight] = useState(0);

  return (
    <View
      ref={containerRef}
      className="flex-1 w-full relative pb-24"
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
      }}
    >
      <ActPath
        points={points}
        height={height}
      />
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
