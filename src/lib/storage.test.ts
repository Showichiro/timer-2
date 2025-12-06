import { describe, it, expect, beforeEach } from 'vitest';
import { loadTimers, saveTimers, STORAGE_KEY } from './storage';
import type { TimerData } from './types';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadTimers', () => {
    it('ローカルストレージにデータがない場合、デフォルトタイマーを返す', () => {
      const timers = loadTimers();

      expect(timers).toHaveLength(1);
      expect(timers[0].name).toBe('タイマー 1');
      expect(timers[0].initialHours).toBe(0);
      expect(timers[0].initialMinutes).toBe(5);
      expect(timers[0].initialSeconds).toBe(0);
      expect(timers[0].id).toBeDefined();
    });

    it('保存されたタイマーデータを読み込む', () => {
      const testTimers: TimerData[] = [
        {
          id: 'test-id-1',
          name: 'テストタイマー',
          initialHours: 1,
          initialMinutes: 30,
          initialSeconds: 45
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testTimers));

      const timers = loadTimers();

      expect(timers).toEqual(testTimers);
    });

    it('不正なJSONの場合、デフォルトタイマーにフォールバックする', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const timers = loadTimers();

      expect(timers).toHaveLength(1);
      expect(timers[0].name).toBe('タイマー 1');
    });
  });

  describe('saveTimers', () => {
    it('タイマーデータをローカルストレージに保存する', () => {
      const testTimers: TimerData[] = [
        {
          id: 'test-id-1',
          name: '保存テスト',
          initialHours: 2,
          initialMinutes: 15,
          initialSeconds: 30
        }
      ];

      saveTimers(testTimers);

      const saved = localStorage.getItem(STORAGE_KEY);
      expect(saved).toBe(JSON.stringify(testTimers));
    });

    it('空の配列も保存できる', () => {
      saveTimers([]);

      const saved = localStorage.getItem(STORAGE_KEY);
      expect(saved).toBe('[]');
    });

    it('複数のタイマーを保存できる', () => {
      const testTimers: TimerData[] = [
        {
          id: 'id-1',
          name: 'タイマー1',
          initialHours: 0,
          initialMinutes: 5,
          initialSeconds: 0
        },
        {
          id: 'id-2',
          name: 'タイマー2',
          initialHours: 1,
          initialMinutes: 0,
          initialSeconds: 0
        }
      ];

      saveTimers(testTimers);

      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(saved).toHaveLength(2);
      expect(saved[0].name).toBe('タイマー1');
      expect(saved[1].name).toBe('タイマー2');
    });
  });
});
