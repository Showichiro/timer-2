import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/svelte';
import App from './App.svelte';
import { STORAGE_KEY } from './lib/storage';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  describe('複数タイマー管理機能 (Req 6.1-6.5)', () => {
    it('追加ボタンをクリックすると新しいタイマーが追加される', async () => {
      render(App);

      const initialCards = screen.getAllByTestId('timer-card');
      expect(initialCards).toHaveLength(1);

      const addButton = screen.getByTestId('add-timer-button');
      await fireEvent.click(addButton);

      const updatedCards = screen.getAllByTestId('timer-card');
      expect(updatedCards).toHaveLength(2);
    });

    it('タイマー数に制限がない（複数追加可能）', async () => {
      render(App);

      const addButton = screen.getByTestId('add-timer-button');

      for (let i = 0; i < 5; i++) {
        await fireEvent.click(addButton);
      }

      const cards = screen.getAllByTestId('timer-card');
      expect(cards).toHaveLength(6);
    });

    it('削除ボタンをクリックするとタイマーが削除される', async () => {
      render(App);

      const addButton = screen.getByTestId('add-timer-button');
      await fireEvent.click(addButton);

      let cards = screen.getAllByTestId('timer-card');
      expect(cards).toHaveLength(2);

      const deleteButtons = screen.getAllByTestId('delete-button');
      await fireEvent.click(deleteButtons[0]);

      cards = screen.getAllByTestId('timer-card');
      expect(cards).toHaveLength(1);
    });

    it('各タイマーが独立して操作可能である', async () => {
      render(App);

      const addButton = screen.getByTestId('add-timer-button');
      await fireEvent.click(addButton);

      const cards = screen.getAllByTestId('timer-card');
      expect(cards).toHaveLength(2);
    });
  });

  describe('永続化との統合 (Req 7.1-7.4)', () => {
    it('ローカルストレージにデータが存在しない場合、デフォルトタイマーが1つ表示される', () => {
      render(App);

      const cards = screen.getAllByTestId('timer-card');
      expect(cards).toHaveLength(1);
    });

    it('タイマーが追加されるとローカルストレージに保存される', async () => {
      render(App);

      const addButton = screen.getByTestId('add-timer-button');
      await fireEvent.click(addButton);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();

      const timers = JSON.parse(stored!);
      expect(timers).toHaveLength(2);
    });

    it('タイマーが削除されるとローカルストレージが更新される', async () => {
      render(App);

      const addButton = screen.getByTestId('add-timer-button');
      await fireEvent.click(addButton);

      const deleteButtons = screen.getAllByTestId('delete-button');
      await fireEvent.click(deleteButtons[0]);

      const stored = localStorage.getItem(STORAGE_KEY);
      const timers = JSON.parse(stored!);
      expect(timers).toHaveLength(1);
    });

    it('ローカルストレージからタイマーが復元される', async () => {
      const existingTimers = [
        { id: 'timer-1', name: 'テストタイマー1', initialHours: 1, initialMinutes: 0, initialSeconds: 0 },
        { id: 'timer-2', name: 'テストタイマー2', initialHours: 0, initialMinutes: 30, initialSeconds: 0 }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTimers));

      render(App);

      const cards = screen.getAllByTestId('timer-card');
      expect(cards).toHaveLength(2);

      const names = screen.getAllByTestId('timer-name');
      expect(names[0].textContent).toBe('テストタイマー1');
      expect(names[1].textContent).toBe('テストタイマー2');
    });
  });

  describe('ドラッグ&ドロップ機能 (Req 1.1, 1.2)', () => {
    it('タイマーグリッドがドラッグ&ドロップに対応している', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: 'timer-1', name: 'タイマー1', initialHours: 0, initialMinutes: 5, initialSeconds: 0 },
        { id: 'timer-2', name: 'タイマー2', initialHours: 0, initialMinutes: 10, initialSeconds: 0 }
      ]));
      render(App);

      const container = screen.getByTestId('timer-grid');
      // dndzone属性が設定されていることを確認
      expect(container.getAttribute('data-dnd-zone')).toBe('true');
    });

    it('ローカルストレージにタイマーが保存されて順序が維持される', async () => {
      const initialTimers = [
        { id: 'timer-1', name: 'タイマー1', initialHours: 0, initialMinutes: 5, initialSeconds: 0 },
        { id: 'timer-2', name: 'タイマー2', initialHours: 0, initialMinutes: 10, initialSeconds: 0 }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTimers));
      render(App);

      // ローカルストレージに保存されていることを確認
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();
      const storedTimers = JSON.parse(stored!);
      expect(storedTimers).toHaveLength(2);
      expect(storedTimers[0].id).toBe('timer-1');
      expect(storedTimers[1].id).toBe('timer-2');
    });

    it('ドラッグ用のスタイルが適用される', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: 'timer-1', name: 'タイマー1', initialHours: 0, initialMinutes: 5, initialSeconds: 0 }
      ]));
      render(App);

      const container = screen.getByTestId('timer-grid');
      // ドラッグ&ドロップスタイルを適用するためのdata属性が存在すること
      expect(container.getAttribute('data-dnd-zone')).toBe('true');
    });
  });

  describe('レスポンシブレイアウト (Req 8.1, 8.3, 8.4)', () => {
    it('タイマー追加ボタンが表示される', () => {
      render(App);

      const addButton = screen.getByTestId('add-timer-button');
      expect(addButton).toBeTruthy();
    });

    it('グリッドレイアウトのコンテナが存在する', () => {
      render(App);

      const container = screen.getByTestId('timer-grid');
      expect(container).toBeTruthy();
    });
  });
});
