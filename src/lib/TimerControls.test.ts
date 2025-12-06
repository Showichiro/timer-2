import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import TimerControls from './TimerControls.svelte';

describe('TimerControls', () => {
  afterEach(() => {
    cleanup();
  });
  describe('ボタン表示', () => {
    it('idle状態では開始ボタンとリセットボタンを表示する', () => {
      const { getByTestId, queryByTestId } = render(TimerControls, {
        props: {
          status: 'idle',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {}
        }
      });

      expect(getByTestId('start-button')).toBeTruthy();
      expect(getByTestId('reset-button')).toBeTruthy();
      expect(queryByTestId('pause-button')).toBeNull();
    });

    it('running状態では一時停止ボタンとリセットボタンを表示する', () => {
      const { getByTestId, queryByTestId } = render(TimerControls, {
        props: {
          status: 'running',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {}
        }
      });

      expect(getByTestId('pause-button')).toBeTruthy();
      expect(getByTestId('reset-button')).toBeTruthy();
      expect(queryByTestId('start-button')).toBeNull();
    });

    it('paused状態では開始ボタンとリセットボタンを表示する', () => {
      const { getByTestId, queryByTestId } = render(TimerControls, {
        props: {
          status: 'paused',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {}
        }
      });

      expect(getByTestId('start-button')).toBeTruthy();
      expect(getByTestId('reset-button')).toBeTruthy();
      expect(queryByTestId('pause-button')).toBeNull();
    });

    it('completed状態では開始ボタンとリセットボタンを表示する', () => {
      const { getByTestId, queryByTestId } = render(TimerControls, {
        props: {
          status: 'completed',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {}
        }
      });

      expect(getByTestId('start-button')).toBeTruthy();
      expect(getByTestId('reset-button')).toBeTruthy();
      expect(queryByTestId('pause-button')).toBeNull();
    });
  });

  describe('イベント発火', () => {
    it('開始ボタンをクリックするとonStartが呼ばれる', async () => {
      const onStart = vi.fn();
      const { getByTestId } = render(TimerControls, {
        props: {
          status: 'idle',
          onStart,
          onPause: () => {},
          onReset: () => {}
        }
      });

      await fireEvent.click(getByTestId('start-button'));
      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it('一時停止ボタンをクリックするとonPauseが呼ばれる', async () => {
      const onPause = vi.fn();
      const { getByTestId } = render(TimerControls, {
        props: {
          status: 'running',
          onStart: () => {},
          onPause,
          onReset: () => {}
        }
      });

      await fireEvent.click(getByTestId('pause-button'));
      expect(onPause).toHaveBeenCalledTimes(1);
    });

    it('リセットボタンをクリックするとonResetが呼ばれる', async () => {
      const onReset = vi.fn();
      const { getByTestId } = render(TimerControls, {
        props: {
          status: 'idle',
          onStart: () => {},
          onPause: () => {},
          onReset
        }
      });

      await fireEvent.click(getByTestId('reset-button'));
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });
});
