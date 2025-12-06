import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/svelte';
import TimerCard from './TimerCard.svelte';
import type { TimerData } from './types';

describe('TimerCard', () => {
  const mockTimer: TimerData = {
    id: 'test-id',
    name: 'テストタイマー',
    initialHours: 0,
    initialMinutes: 0,
    initialSeconds: 5,
  };

  let mockOnUpdate: (timer: TimerData) => void;
  let mockOnDelete: (id: string) => void;

  beforeEach(() => {
    mockOnUpdate = vi.fn();
    mockOnDelete = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  describe('3.1 個別タイマーの表示と状態管理', () => {
    it('初期状態でタイマーの残り時間を正しく表示する', () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      expect(getByTestId('timer-display').textContent).toBe('00:00:05');
    });

    it('開始ボタンが初期状態で表示される', () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      expect(getByTestId('start-button')).toBeTruthy();
    });

    it('開始ボタンをクリックするとカウントダウンが開始される', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('start-button'));

      // 1秒後に時間が減っているか確認
      await waitFor(
        () => {
          expect(getByTestId('timer-display').textContent).toBe('00:00:04');
        },
        { timeout: 2000 }
      );
    });

    it('動作中は一時停止ボタンが表示される', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('start-button'));

      expect(getByTestId('pause-button')).toBeTruthy();
    });

    it('一時停止ボタンをクリックするとカウントダウンが停止する', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('start-button'));

      // 少し待ってからカウントダウンが始まったことを確認
      await waitFor(
        () => {
          expect(getByTestId('timer-display').textContent).toBe('00:00:04');
        },
        { timeout: 2000 }
      );

      await fireEvent.click(getByTestId('pause-button'));

      const timeAfterPause = getByTestId('timer-display').textContent;

      // 停止後は時間が変わらないことを確認
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(getByTestId('timer-display').textContent).toBe(timeAfterPause);
    });

    it('リセットボタンをクリックすると初期時間に戻る', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('start-button'));

      // カウントダウンが始まるまで待つ
      await waitFor(
        () => {
          expect(getByTestId('timer-display').textContent).toBe('00:00:04');
        },
        { timeout: 2000 }
      );

      await fireEvent.click(getByTestId('reset-button'));

      expect(getByTestId('timer-display').textContent).toBe('00:00:05');
      expect(getByTestId('start-button')).toBeTruthy();
    });

    it('カウントダウン中は1秒ごとに更新される', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      expect(getByTestId('timer-display').textContent).toBe('00:00:05');

      await fireEvent.click(getByTestId('start-button'));

      await waitFor(
        () => {
          expect(getByTestId('timer-display').textContent).toBe('00:00:04');
        },
        { timeout: 2000 }
      );

      await waitFor(
        () => {
          expect(getByTestId('timer-display').textContent).toBe('00:00:03');
        },
        { timeout: 2000 }
      );
    });

    it('カードにLavenderテーマのスタイリングが適用されている', () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      const card = getByTestId('timer-card');
      expect(card.classList.toString()).toMatch(/lavender/);
    });
  });

  describe('3.2 タイマー名の編集機能', () => {
    it('タイマー名が表示される', () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      expect(getByTestId('timer-name').textContent).toBe('テストタイマー');
    });

    it('タイマー名をクリックすると編集モードになる', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('timer-name'));

      expect(getByTestId('timer-name-input')).toBeTruthy();
    });

    it('編集モードで名前を入力して確定できる', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('timer-name'));

      const input = getByTestId('timer-name-input') as HTMLInputElement;
      await fireEvent.input(input, { target: { value: '新しい名前' } });
      await fireEvent.blur(input);

      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ name: '新しい名前' })
      );
    });

    it('Enterキーで編集を確定できる', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('timer-name'));

      const input = getByTestId('timer-name-input') as HTMLInputElement;
      await fireEvent.input(input, { target: { value: 'Enterで確定' } });
      await fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Enterで確定' })
      );
    });

    it('タイマー名が未設定の場合はデフォルト名が表示される', () => {
      const timerWithEmptyName = { ...mockTimer, name: '' };
      const { getByTestId } = render(TimerCard, {
        props: { timer: timerWithEmptyName, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      expect(getByTestId('timer-name').textContent).toBe('タイマー 1');
    });
  });

  describe('3.3 タイマー完了時の通知機能', () => {
    it('タイマーが完了すると視覚的な通知が表示される', async () => {
      const shortTimer: TimerData = {
        id: 'test-id',
        name: 'ショートタイマー',
        initialHours: 0,
        initialMinutes: 0,
        initialSeconds: 2,
      };

      const { getByTestId } = render(TimerCard, {
        props: { timer: shortTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('start-button'));

      // タイマーが0になるまで待つ
      await waitFor(
        () => {
          expect(getByTestId('timer-display').textContent).toBe('00:00:00');
        },
        { timeout: 4000 }
      );

      // 完了状態のスタイリングが適用されているか確認
      const card = getByTestId('timer-card');
      expect(card.classList.toString()).toMatch(/completed|animate|ring/);
    });

    it('削除ボタンが表示される', () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      expect(getByTestId('delete-button')).toBeTruthy();
    });

    it('削除ボタンをクリックするとonDeleteが呼ばれる', async () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      await fireEvent.click(getByTestId('delete-button'));

      expect(mockOnDelete).toHaveBeenCalledWith('test-id');
    });
  });

  describe('5.1 タイマー完了時の通知統合', () => {
    it('settingsプロパティを受け取れる', () => {
      const settings = { soundEnabled: true };
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete, settings },
      });

      expect(getByTestId('timer-card')).toBeTruthy();
    });

    it('soundEnabled=falseの場合でも視覚的な通知は動作する', async () => {
      const shortTimer: TimerData = {
        id: 'test-id',
        name: 'ショートタイマー',
        initialHours: 0,
        initialMinutes: 0,
        initialSeconds: 2,
      };
      const settings = { soundEnabled: false };

      const { getByTestId } = render(TimerCard, {
        props: { timer: shortTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete, settings },
      });

      await fireEvent.click(getByTestId('start-button'));

      await waitFor(
        () => {
          expect(getByTestId('timer-display').textContent).toBe('00:00:00');
        },
        { timeout: 4000 }
      );

      const card = getByTestId('timer-card');
      expect(card.classList.toString()).toMatch(/completed|animate|ring/);
    });

    it('タイマーカードにdata-timer-id属性が設定されている', () => {
      const { getByTestId } = render(TimerCard, {
        props: { timer: mockTimer, onUpdate: mockOnUpdate, onDelete: mockOnDelete },
      });

      const card = getByTestId('timer-card');
      expect(card.getAttribute('data-timer-id')).toBe('test-id');
    });
  });
});
