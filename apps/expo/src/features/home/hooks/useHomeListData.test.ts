import { renderHook } from '@testing-library/react-native';

import { useHomeListData } from './useHomeListData';

jest.mock('@assets/images/learning/anxiety.png', () => 'anxiety.png');
jest.mock('@assets/images/learning/pado.png', () => 'pado.png');

describe('useHomeListData', () => {
  describe('HISTORY 페이지', () => {
    it('기록 항목을 날짜별로 그룹화한다', () => {
      const historyPages = [
        { id: '1', type: 'EMOTION_NOTE' as const, time: '20250120' },
        { id: '2', type: 'ACCEPTANCE' as const, time: '20250120' },
        { id: '3', type: 'CONTACT_WITH_PRESENT' as const, time: '20250119' },
      ];

      const { result } = renderHook(() =>
        useHomeListData({ page: 'HISTORY', historyPages }),
      );

      expect(result.current).toHaveLength(2);
      expect(result.current[0].id).toBe('20250120');
      expect(result.current[1].id).toBe('20250119');
    });

    it('날짜 기준 최신순으로 정렬한다', () => {
      const historyPages = [
        { id: '1', type: 'EMOTION_NOTE' as const, time: '20250101' },
        { id: '2', type: 'ACCEPTANCE' as const, time: '20250123' },
        { id: '3', type: 'CONTACT_WITH_PRESENT' as const, time: '20250110' },
      ];

      const { result } = renderHook(() =>
        useHomeListData({ page: 'HISTORY', historyPages }),
      );

      expect(result.current[0].id).toBe('20250123');
      expect(result.current[1].id).toBe('20250110');
      expect(result.current[2].id).toBe('20250101');
    });

    it('같은 날짜의 항목들은 items 배열에 포함된다', () => {
      const historyPages = [
        { id: '1', type: 'EMOTION_NOTE' as const, time: '20250120' },
        { id: '2', type: 'ACCEPTANCE' as const, time: '20250120' },
      ];

      const { result } = renderHook(() =>
        useHomeListData({ page: 'HISTORY', historyPages }),
      );

      const group = result.current[0];
      expect(group.type).toBe('HISTORY');
      if (group.type === 'HISTORY') {
        expect(group.items).toHaveLength(2);
        expect(group.items[0]).toEqual({ id: '1', type: 'EMOTION_NOTE' });
        expect(group.items[1]).toEqual({ id: '2', type: 'ACCEPTANCE' });
      }
    });

    it('기록이 없으면 빈 배열을 반환한다', () => {
      const { result } = renderHook(() =>
        useHomeListData({ page: 'HISTORY', historyPages: [] }),
      );

      expect(result.current).toEqual([]);
    });
  });

  describe('HOME 페이지', () => {
    it('HOME 타입 아이템 하나를 반환한다', () => {
      const { result } = renderHook(() =>
        useHomeListData({ page: 'HOME', historyPages: [] }),
      );

      expect(result.current).toEqual([{ id: 'HOME', type: 'HOME' }]);
    });
  });

  describe('LEARNING 페이지', () => {
    it('학습 아이템 목록을 반환한다', () => {
      const { result } = renderHook(() =>
        useHomeListData({ page: 'LEARNING', historyPages: [] }),
      );

      expect(result.current).toHaveLength(2);
      expect(result.current[0].type).toBe('LEARNING');
      expect(result.current[1].type).toBe('LEARNING');
    });
  });
});
