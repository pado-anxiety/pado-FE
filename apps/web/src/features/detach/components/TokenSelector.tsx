import { useRef } from 'react';

import { Text } from '@pado/ui';

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

  const onDraggingStart = () => {
    isDragging.current = true;
  };

  const updateHighlight = (index: number, mode?: boolean) => {
    const t: UserTextToken = userTextTokens[index];

    const m = mode !== null ? mode : !t.isSelected;
    setUserTextTokens((prev: UserTextToken[]) => {
      if (prev[index].isSelected === m) {
        return prev;
      }

      const next = [...prev];
      next[index] = { ...t, isSelected: !!m };
      return next;
    });
  };

  const onDragging = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

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

  return (
    <div
      className="flex flex-row gap-1 flex-wrap"
      onPointerMove={onDragging}
      onPointerUp={onDraggingEnd}
      onPointerDown={onDraggingStart}
      style={{ touchAction: 'none' }}
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
