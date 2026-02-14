import { useCallback, useRef } from 'react';

import { LayoutRectangle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';

import type { UserTextToken } from '../types';

interface TokenSelectorProps {
  userTextTokens: UserTextToken[];
  setUserTextTokens: (tokens: UserTextToken[]) => void;
}

export function TokenSelector({
  userTextTokens,
  setUserTextTokens,
}: TokenSelectorProps) {
  const tokenLayouts = useRef<(LayoutRectangle | null)[]>([]);
  const tokensRef = useRef(userTextTokens);
  tokensRef.current = userTextTokens;

  const selectedMode = useRef<boolean | null>(null);
  const lastToggled = useRef<number>(-1);
  const containerOffset = useRef({ x: 0, y: 0 });

  const findTokenAtPosition = useCallback((gx: number, gy: number): number => {
    const x = gx - containerOffset.current.x;
    const y = gy - containerOffset.current.y;

    for (let i = 0; i < tokenLayouts.current.length; i++) {
      const layout = tokenLayouts.current[i];
      if (!layout) continue;
      if (
        x >= layout.x &&
        x <= layout.x + layout.width &&
        y >= layout.y &&
        y <= layout.y + layout.height
      ) {
        return i;
      }
    }
    return -1;
  }, []);

  const applyHighlight = useCallback(
    (index: number) => {
      if (index < 0 || index === lastToggled.current) return;
      lastToggled.current = index;

      const tokens = tokensRef.current;
      if (selectedMode.current === null) {
        selectedMode.current = !tokens[index].isSelected;
      }

      const mode = selectedMode.current;
      if (tokens[index].isSelected === mode) return;

      triggerHaptic('SELECT');
      const next = [...tokens];
      next[index] = { ...next[index], isSelected: mode };
      tokensRef.current = next;
      setUserTextTokens(next);
    },
    [setUserTextTokens],
  );

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onBegin((e) => {
      lastToggled.current = -1;
      selectedMode.current = null;

      const index = findTokenAtPosition(e.x, e.y);
      applyHighlight(index);
    })
    .onUpdate((e) => {
      const index = findTokenAtPosition(e.x, e.y);
      applyHighlight(index);
    })
    .onEnd(() => {
      selectedMode.current = null;
      lastToggled.current = -1;
    });

  const handleTokenLayout = useCallback(
    (index: number, layout: LayoutRectangle) => {
      tokenLayouts.current[index] = layout;
    },
    [],
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View className="flex-1 rounded-2xl border border-subtle bg-surface/50 p-4">
        <View
          className="flex-row flex-wrap gap-1"
          onLayout={(e) => {
            containerOffset.current = {
              x: e.nativeEvent.layout.x,
              y: e.nativeEvent.layout.y,
            };
          }}
        >
          {userTextTokens.map((token, index) => (
            <View
              key={`${token.text}-${index}`}
              onLayout={(e) => handleTokenLayout(index, e.nativeEvent.layout)}
            >
              <Text
                preset="body"
                style={{
                  backgroundColor: token.isSelected
                    ? '#ffec5dff'
                    : 'transparent',
                  borderRadius: 4,
                  overflow: 'hidden',
                  paddingHorizontal: 2,
                }}
              >
                {token.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}
