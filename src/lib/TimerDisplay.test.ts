import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import TimerDisplay from './TimerDisplay.svelte';

describe('TimerDisplay', () => {
  afterEach(() => {
    cleanup();
  });
  describe('時間フォーマット', () => {
    it('0秒を00:00:00形式で表示する', () => {
      const { getByText } = render(TimerDisplay, { props: { seconds: 0 } });
      expect(getByText('00:00:00')).toBeTruthy();
    });

    it('59秒を00:00:59形式で表示する', () => {
      const { getByText } = render(TimerDisplay, { props: { seconds: 59 } });
      expect(getByText('00:00:59')).toBeTruthy();
    });

    it('60秒を00:01:00形式で表示する', () => {
      const { getByText } = render(TimerDisplay, { props: { seconds: 60 } });
      expect(getByText('00:01:00')).toBeTruthy();
    });

    it('3661秒を01:01:01形式で表示する', () => {
      const { getByText } = render(TimerDisplay, { props: { seconds: 3661 } });
      expect(getByText('01:01:01')).toBeTruthy();
    });

    it('99時間59分59秒を正しく表示する', () => {
      const seconds = 99 * 3600 + 59 * 60 + 59;
      const { getByText } = render(TimerDisplay, { props: { seconds } });
      expect(getByText('99:59:59')).toBeTruthy();
    });
  });

  describe('スタイリング', () => {
    it('時間表示要素がレンダリングされる', () => {
      const { container } = render(TimerDisplay, { props: { seconds: 0 } });
      const timeElement = container.querySelector('[data-testid="timer-display"]');
      expect(timeElement).toBeTruthy();
    });
  });
});
