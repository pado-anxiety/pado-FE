import { useRef } from 'react';

import { Text } from '@pado/ui';

import { triggerHaptic } from '@/lib';

import { UserTextToken } from '../types';

type TokenSelectorProps = {
  userTextTokens: UserTextToken[];
  setUserTextTokens: React.Dispatch<React.SetStateAction<UserTextToken[]>>;
};

export function TokenSelector({
  userTextTokens,
  setUserTextTokens,
}: TokenSelectorProps) {
  const isDragging = useRef<boolean>(false);
  const selectedMode = useRef<boolean | null>(null); // true=highlight

  const startY = useRef<number>(0);
  const onDraggingStart = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startY.current = e.clientY;
  };

  const updateHighlight = (index: number, mode?: boolean) => {
    const t: UserTextToken = userTextTokens[index];

    const m = mode ?? !t.isSelected;

    setUserTextTokens((prev: UserTextToken[]) => {
      if (prev[index].isSelected === m) {
        return prev;
      }

      triggerHaptic('SELECT');
      const next = [...prev];
      next[index] = { ...t, isSelected: !!m };
      return next;
    });
  };

  const onDragging = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) {
      return;
    }

    const diffY = Math.abs(e.clientY - startY.current);
    if (diffY > 10) {
      return;
    }

    const target = document.elementFromPoint(
      e.clientX,
      e.clientY,
    ) as HTMLElement;

    if (target && target.dataset.index) {
      const index = parseInt(target.dataset.index);
      if (selectedMode.current === null) {
        selectedMode.current = !userTextTokens[index].isSelected;
      }
      updateHighlight(index, selectedMode.current);
    }
  };

  const onDraggingEnd = () => {
    isDragging.current = false;
    selectedMode.current = null;
  };

  // TODO: 스크롤 넘침 문제
  return (
    <div
      className="max-h-1000 flex flex-row gap-1 flex-wrap mt-4 p-4 bg-white/50 rounded-xl border border-white scrollbar-hide"
      onPointerMove={onDragging}
      onPointerUp={onDraggingEnd}
      onPointerDown={onDraggingStart}
    >
      {userTextTokens.map(({ text, isSelected }, index) => (
        <Text
          data-index={index}
          key={`${text + index}`}
          className="text-body-medium"
          style={{ backgroundColor: isSelected ? 'yellow' : 'transparent' }}
          onClick={() => updateHighlight(index)}
        >
          {text}
        </Text>
      ))}
    </div>
  );
}
