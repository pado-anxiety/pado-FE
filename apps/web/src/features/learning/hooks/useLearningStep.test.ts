import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { useLearningStep } from './useLearningStep';

const mockHandlePostMessage = vi.fn();
const mockTriggerHaptic = vi.fn();
const mockGetDuration = vi.fn().mockReturnValue(1000);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { returnObjects: boolean }) => {
      if (opts?.returnObjects) return ['내용1', '내용2'];
      return key;
    },
  }),
}));

vi.mock('@/lib', () => ({
  handlePostMessage: (...args: unknown[]) => mockHandlePostMessage(...args),
  triggerHaptic: (...args: unknown[]) => mockTriggerHaptic(...args),
}));

vi.mock('@/lib/analytics/useDuration', () => ({
  useDuration: () => ({ getDuration: mockGetDuration }),
}));

describe('useLearningStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('초기 상태는 첫 번째 스텝이다', () => {
    const { result } = renderHook(() => useLearningStep('anxiety_info'));

    expect(result.current.stepIndex).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
  });

  it('학습 데이터가 5개의 스텝을 가진다', () => {
    const { result } = renderHook(() => useLearningStep('anxiety_info'));

    expect(result.current.totalSteps).toBe(5);
  });

  it('handleNext 호출 시 다음 스텝으로 이동한다', () => {
    const { result } = renderHook(() => useLearningStep('anxiety_info'));

    act(() => { result.current.handleNext(); });

    expect(result.current.stepIndex).toBe(1);
    expect(mockHandlePostMessage).toHaveBeenCalledWith('NAVIGATE', {
      action: 'NEXT',
      step: 0,
      duration: 1000,
    });
  });

  it('마지막 스텝에서 handleNext 호출 시 HOME 메시지를 전송한다', () => {
    const { result } = renderHook(() => useLearningStep('anxiety_info'));

    // 마지막 스텝까지 이동
    for (let i = 0; i < 4; i++) {
      act(() => { result.current.handleNext(); });
    }
    expect(result.current.isLastStep).toBe(true);

    act(() => { result.current.handleNext(); });

    expect(mockHandlePostMessage).toHaveBeenLastCalledWith('NAVIGATE', {
      action: 'HOME',
      duration: 1000,
    });
  });

  it('handlePrev 호출 시 이전 스텝으로 이동한다', () => {
    const { result } = renderHook(() => useLearningStep('anxiety_info'));

    act(() => { result.current.handleNext(); });
    expect(result.current.stepIndex).toBe(1);

    act(() => { result.current.handlePrev(); });
    expect(result.current.stepIndex).toBe(0);
  });

  it('첫 번째 스텝에서 handlePrev는 동작하지 않는다', () => {
    const { result } = renderHook(() => useLearningStep('anxiety_info'));

    act(() => { result.current.handlePrev(); });

    expect(result.current.stepIndex).toBe(0);
    expect(mockTriggerHaptic).not.toHaveBeenCalled();
  });

  it('handleExit 호출 시 HOME 메시지를 전송한다', () => {
    const { result } = renderHook(() => useLearningStep('anxiety_info'));

    act(() => { result.current.handleExit(); });

    expect(mockHandlePostMessage).toHaveBeenCalledWith('NAVIGATE', {
      action: 'HOME',
      duration: 1000,
    });
  });
});
