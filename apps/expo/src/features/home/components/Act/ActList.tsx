import { useRef, useState } from 'react';

import { View } from '@src/components/ui';

import { ACT_MENU_LIST } from '../../constants';
import { ActPath } from './ActPath';
import { ActStep } from './ActStep';
import { Point } from './types';

interface ActListProps {
  onContentHeight?: (height: number) => void;
}

export function ActList({ onContentHeight }: ActListProps): React.ReactNode {
  const containerRef = useRef<View>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [height, setHeight] = useState(0);

  return (
    <View
      ref={containerRef}
      className="relative w-full flex-1 px-4 pb-24 pt-12"
      onLayout={(event) => {
        const h = event.nativeEvent.layout.height;
        setHeight(h);
        onContentHeight?.(h);
      }}
    >
      <ActPath
        points={points}
        height={height}
      />
      <View className="w-full flex-1 flex-col items-center gap-24">
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
