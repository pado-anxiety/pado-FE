import { useCallback, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native';

import { useFunnel } from '@src/hooks/useFunnel';
import { diaryAPI } from '@src/lib/api/diary';
import { triggerHaptic } from '@src/lib/haptics';

import {
  BASIC_EMOTIONS,
  DIARY_FUNNEL_STEPS,
  EMOTION_CATEGORIES,
  MAX_CHAR_LIMIT,
} from '../constants';
import type { DiaryFunnelContext, DiaryStepId, EmotionItem } from '../types';

const normalize = (text: string) => text.trim().replace(/\n{2,}/g, '\n');

export function useDiaryWrite() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const textInputRef = useRef<TextInput>(null);

  // Funnel
  const funnel = useFunnel<DiaryStepId, DiaryFunnelContext>({
    id: 'diary-write',
    steps: DIARY_FUNNEL_STEPS,
    initialContext: { situation: '', thought: '', emotions: [] },
    onComplete: async (ctx) => {
      try {
        await diaryAPI.create({
          situation: ctx.situation,
          thoughts: ctx.thought,
          feelings: ctx.emotions,
        });
      } catch (e) {
        console.error('[diary] create failed:', e);
      }
      queryClient.invalidateQueries({ queryKey: ['diary-monthly'] });
      triggerHaptic('EFFECT');
      router.back();
    },
  });

  // Local state
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<Set<string>>(
    new Set(),
  );

  // Handlers
  const toggleEmotion = useCallback((label: string) => {
    setSelectedEmotions((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else if (next.size < 3) {
        next.add(label);
      }
      return next;
    });
  }, []);

  const handleNext = useCallback(async () => {
    triggerHaptic('NAVIGATE');

    if (funnel.currentStep === 'situation') {
      if (!situation.trim()) return;
      await funnel.history.push(undefined, { situation: normalize(situation) });
    } else if (funnel.currentStep === 'thought') {
      if (!thought.trim()) return;
      await funnel.history.push(undefined, (prev) => ({
        ...prev,
        thought: normalize(thought),
      }));
    } else if (funnel.currentStep === 'emotion') {
      if (selectedEmotions.size === 0) return;
      await funnel.history.push(undefined, (prev) => ({
        ...prev,
        emotions: Array.from(selectedEmotions),
      }));
    }
  }, [funnel, situation, thought, selectedEmotions]);

  const handlePrev = useCallback(() => {
    triggerHaptic('NAVIGATE');
    if (funnel.isFirst) router.back();
    else funnel.history.back();
  }, [funnel, router]);

  const handleChipSelect = useCallback(
    (chip: string) => {
      const setter =
        funnel.currentStep === 'situation' ? setSituation : setThought;
      setter((prev) => {
        if (prev.includes(chip)) return prev;
        const next = prev ? `${prev} ${chip}` : chip;
        return next.length > MAX_CHAR_LIMIT ? prev : next;
      });
    },
    [funnel.currentStep],
  );

  // Derived
  const currentText = funnel.currentStep === 'situation' ? situation : thought;
  const currentSetter =
    funnel.currentStep === 'situation' ? setSituation : setThought;
  const stepI18nKey = `diary.write.${funnel.currentStep}` as const;

  const isNextDisabled =
    (funnel.currentStep === 'situation' && !situation.trim()) ||
    (funnel.currentStep === 'thought' && !thought.trim()) ||
    (funnel.currentStep === 'emotion' && selectedEmotions.size === 0);

  // Merged emotions: BASIC + selected from bottom sheet
  const allEmotions: EmotionItem[] = useMemo(
    () => [
      ...BASIC_EMOTIONS,
      ...Array.from(selectedEmotions)
        .filter((label) => !BASIC_EMOTIONS.some((e) => e.label === label))
        .map((label) => {
          const found = EMOTION_CATEGORIES.flatMap((c) => c.emotions).find(
            (e) => e.label === label,
          );
          return { emoji: found?.emoji ?? '', label };
        }),
    ],
    [selectedEmotions],
  );

  return {
    funnel,
    situation,
    thought,
    selectedEmotions,
    textInputRef,
    allEmotions,
    currentText,
    currentSetter,
    stepI18nKey,
    isNextDisabled,
    handleNext,
    handlePrev,
    handleChipSelect,
    toggleEmotion,
  };
}
