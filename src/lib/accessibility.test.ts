import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/svelte';
import App from '../App.svelte';
import TimerCard from './TimerCard.svelte';
import TimerControls from './TimerControls.svelte';
import TimeInput from './TimeInput.svelte';
import SettingsPanel from './SettingsPanel.svelte';
import { STORAGE_KEY } from './storage';
import type { TimerData } from './types';

describe('アクセシビリティテスト (Req 2.1, 2.2, 2.4)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  describe('ARIAラベルの検証 (Req 2.2)', () => {
    const mockTimer: TimerData = {
      id: 'test-id',
      name: 'テストタイマー',
      initialHours: 0,
      initialMinutes: 5,
      initialSeconds: 0,
    };

    it('削除ボタンにaria-labelが設定されている', () => {
      render(TimerCard, {
        props: {
          timer: mockTimer,
          onUpdate: () => {},
          onDelete: () => {},
        },
      });

      const deleteButton = screen.getByTestId('delete-button');
      expect(deleteButton.getAttribute('aria-label')).toBe('タイマーを削除');
    });

    it('タイマー名ボタンにaria-labelが設定されている', () => {
      render(TimerCard, {
        props: {
          timer: mockTimer,
          onUpdate: () => {},
          onDelete: () => {},
        },
      });

      const nameButton = screen.getByTestId('timer-name');
      expect(nameButton.getAttribute('aria-label')).toBe('タイマー名を変更するにはクリック');
    });

    it('開始ボタンにaria-labelが設定されている', () => {
      render(TimerControls, {
        props: {
          status: 'idle',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {},
        },
      });

      const startButton = screen.getByTestId('start-button');
      expect(startButton.getAttribute('aria-label')).toBe('タイマーを開始');
    });

    it('一時停止ボタンにaria-labelが設定されている', () => {
      render(TimerControls, {
        props: {
          status: 'running',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {},
        },
      });

      const pauseButton = screen.getByTestId('pause-button');
      expect(pauseButton.getAttribute('aria-label')).toBe('タイマーを一時停止');
    });

    it('リセットボタンにaria-labelが設定されている', () => {
      render(TimerControls, {
        props: {
          status: 'idle',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {},
        },
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton.getAttribute('aria-label')).toBe('タイマーをリセット');
    });

    it('タイマー操作グループにrole="group"とaria-labelが設定されている', () => {
      render(TimerControls, {
        props: {
          status: 'idle',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {},
        },
      });

      const controlsGroup = screen.getByRole('group');
      expect(controlsGroup.getAttribute('aria-label')).toBe('タイマー操作');
    });

    it('時間入力フィールドにaria-labelが設定されている', () => {
      render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange: () => {},
          onSecondsChange: () => {},
        },
      });

      const hoursInput = screen.getByTestId('hours-input');
      const minutesInput = screen.getByTestId('minutes-input');
      const secondsInput = screen.getByTestId('seconds-input');

      expect(hoursInput.getAttribute('aria-label')).toBe('時間');
      expect(minutesInput.getAttribute('aria-label')).toBe('分');
      expect(secondsInput.getAttribute('aria-label')).toBe('秒');
    });

    it('タイマー名編集入力にaria-labelが設定されている', async () => {
      render(TimerCard, {
        props: {
          timer: mockTimer,
          onUpdate: () => {},
          onDelete: () => {},
        },
      });

      const nameButton = screen.getByTestId('timer-name');
      await fireEvent.click(nameButton);

      const nameInput = screen.getByTestId('timer-name-input');
      expect(nameInput.getAttribute('aria-label')).toBe('タイマー名を編集');
    });
  });

  describe('キーボードフォーカスインジケーター (Req 2.1)', () => {
    it('ボタン要素にfocus-visibleスタイルクラスが適用されている', () => {
      render(TimerControls, {
        props: {
          status: 'idle',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {},
        },
      });

      const startButton = screen.getByTestId('start-button');
      const resetButton = screen.getByTestId('reset-button');

      expect(startButton.className).toContain('focus-visible:ring');
      expect(resetButton.className).toContain('focus-visible:ring');
    });

    it('入力フィールドにfocus-visibleスタイルクラスが適用されている', () => {
      render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange: () => {},
          onSecondsChange: () => {},
        },
      });

      const hoursInput = screen.getByTestId('hours-input');
      const minutesInput = screen.getByTestId('minutes-input');
      const secondsInput = screen.getByTestId('seconds-input');

      expect(hoursInput.className).toContain('focus-visible:ring');
      expect(minutesInput.className).toContain('focus-visible:ring');
      expect(secondsInput.className).toContain('focus-visible:ring');
    });

    it('削除ボタンにfocus-visibleスタイルクラスが適用されている', () => {
      const mockTimer: TimerData = {
        id: 'test-id',
        name: 'テストタイマー',
        initialHours: 0,
        initialMinutes: 5,
        initialSeconds: 0,
      };

      render(TimerCard, {
        props: {
          timer: mockTimer,
          onUpdate: () => {},
          onDelete: () => {},
        },
      });

      const deleteButton = screen.getByTestId('delete-button');
      expect(deleteButton.className).toContain('focus-visible:ring');
    });
  });

  describe('キーボードアクセシビリティ (Req 2.1)', () => {
    it('全てのボタンがフォーカス可能である', () => {
      render(TimerControls, {
        props: {
          status: 'idle',
          onStart: () => {},
          onPause: () => {},
          onReset: () => {},
        },
      });

      const startButton = screen.getByTestId('start-button');
      const resetButton = screen.getByTestId('reset-button');

      // ボタン要素はデフォルトでフォーカス可能
      expect(startButton.tagName).toBe('BUTTON');
      expect(resetButton.tagName).toBe('BUTTON');
    });

    it('入力フィールドがフォーカス可能である', () => {
      render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange: () => {},
          onSecondsChange: () => {},
        },
      });

      const hoursInput = screen.getByTestId('hours-input');
      const minutesInput = screen.getByTestId('minutes-input');
      const secondsInput = screen.getByTestId('seconds-input');

      // input要素はデフォルトでフォーカス可能
      expect(hoursInput.tagName).toBe('INPUT');
      expect(minutesInput.tagName).toBe('INPUT');
      expect(secondsInput.tagName).toBe('INPUT');
    });

    it('Enterキーでタイマー名の編集を確定できる', async () => {
      const mockTimer: TimerData = {
        id: 'test-id',
        name: 'テストタイマー',
        initialHours: 0,
        initialMinutes: 5,
        initialSeconds: 0,
      };
      let updatedTimer: TimerData | null = null;

      render(TimerCard, {
        props: {
          timer: mockTimer,
          onUpdate: (t: TimerData) => { updatedTimer = t; },
          onDelete: () => {},
        },
      });

      const nameButton = screen.getByTestId('timer-name');
      await fireEvent.click(nameButton);

      const nameInput = screen.getByTestId('timer-name-input') as HTMLInputElement;
      await fireEvent.input(nameInput, { target: { value: '新しい名前' } });
      await fireEvent.keyDown(nameInput, { key: 'Enter' });

      expect(updatedTimer).not.toBeNull();
      expect(updatedTimer!.name).toBe('新しい名前');
    });
  });

  describe('設定パネルのアクセシビリティ', () => {
    it('トグルスイッチにアクセシビリティ属性が設定されている', () => {
      render(SettingsPanel, {
        props: {
          onSettingsChange: () => {},
        },
      });

      const soundToggle = screen.getByTestId('sound-toggle');
      // input[type="checkbox"]はアクセシブル
      expect(soundToggle.tagName).toBe('INPUT');
      expect(soundToggle.getAttribute('type')).toBe('checkbox');
      expect(soundToggle.getAttribute('aria-label')).toBe('通知音のオン/オフ');
    });

    it('通知許可ボタンがアクセシブルである', () => {
      render(SettingsPanel, {
        props: {
          onSettingsChange: () => {},
        },
      });

      const permissionButton = screen.getByTestId('notification-permission-button');
      expect(permissionButton.tagName).toBe('BUTTON');
      expect(permissionButton.getAttribute('aria-label')).toBe('ブラウザ通知を許可する');
    });
  });

  describe('Appコンポーネントのアクセシビリティ', () => {
    it('追加ボタンがアクセシブルである', () => {
      render(App);

      const addButton = screen.getByTestId('add-timer-button');
      expect(addButton.tagName).toBe('BUTTON');
      expect(addButton.className).toContain('focus-visible:ring');
    });

    it('ハンバーガーメニューボタンにaria-expandedが設定されている', async () => {
      render(App);

      const menuButton = screen.getByTestId('hamburger-menu-button');

      // 初期状態はclosed
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');

      await fireEvent.click(menuButton);

      // 開いた状態
      expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
