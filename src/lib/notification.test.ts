import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  requestPermission,
  getPermissionStatus,
  showNotification,
  flashTitle,
  type NotificationPermissionStatus,
  type NotificationOptions,
} from './notification';

describe('notification', () => {
  // Notification APIのモック
  const originalNotification = globalThis.Notification;
  let mockNotificationPermission: NotificationPermissionStatus = 'default';
  let mockNotificationInstance: Partial<Notification> | null = null;

  beforeEach(() => {
    mockNotificationPermission = 'default';
    mockNotificationInstance = null;

    // Notification APIをモック
    const MockNotification = vi.fn(function (
      this: Partial<Notification>,
      title: string,
      options?: globalThis.NotificationOptions
    ) {
      mockNotificationInstance = {
        onclick: null,
        close: vi.fn(),
      };
      return mockNotificationInstance;
    }) as unknown as typeof Notification;

    Object.defineProperty(MockNotification, 'permission', {
      get: () => mockNotificationPermission,
      configurable: true,
    });

    MockNotification.requestPermission = vi.fn(async (): Promise<NotificationPermission> => {
      mockNotificationPermission = 'granted';
      return 'granted';
    });

    globalThis.Notification = MockNotification;
  });

  afterEach(() => {
    globalThis.Notification = originalNotification;
    vi.restoreAllMocks();
  });

  describe('getPermissionStatus', () => {
    it('現在の許可ステータスを返す（default）', () => {
      mockNotificationPermission = 'default';
      expect(getPermissionStatus()).toBe('default');
    });

    it('現在の許可ステータスを返す（granted）', () => {
      mockNotificationPermission = 'granted';
      expect(getPermissionStatus()).toBe('granted');
    });

    it('現在の許可ステータスを返す（denied）', () => {
      mockNotificationPermission = 'denied';
      expect(getPermissionStatus()).toBe('denied');
    });
  });

  describe('requestPermission', () => {
    it('通知許可をリクエストし、結果を返す', async () => {
      const result = await requestPermission();
      expect(globalThis.Notification.requestPermission).toHaveBeenCalled();
      expect(result).toBe('granted');
    });
  });

  describe('showNotification', () => {
    it('許可されている場合に通知を表示する', () => {
      mockNotificationPermission = 'granted';

      const notification = showNotification({
        title: 'タイマー完了',
        body: 'タイマーが終了しました',
      });

      expect(notification).not.toBeNull();
      expect(globalThis.Notification).toHaveBeenCalledWith('タイマー完了', {
        body: 'タイマーが終了しました',
        icon: undefined,
        tag: undefined,
      });
    });

    it('許可されていない場合はnullを返す', () => {
      mockNotificationPermission = 'denied';

      const notification = showNotification({
        title: 'タイマー完了',
      });

      expect(notification).toBeNull();
    });

    it('default状態ではnullを返す', () => {
      mockNotificationPermission = 'default';

      const notification = showNotification({
        title: 'タイマー完了',
      });

      expect(notification).toBeNull();
    });

    it('onClickコールバックが設定される', () => {
      mockNotificationPermission = 'granted';
      const onClick = vi.fn();

      showNotification({
        title: 'タイマー完了',
        onClick,
      });

      expect(mockNotificationInstance).not.toBeNull();
      // onclickハンドラが設定されていることを確認
      expect(mockNotificationInstance!.onclick).not.toBeNull();
    });

    it('tagオプションが渡される', () => {
      mockNotificationPermission = 'granted';

      showNotification({
        title: 'タイマー完了',
        tag: 'timer-123',
      });

      expect(globalThis.Notification).toHaveBeenCalledWith(
        'タイマー完了',
        expect.objectContaining({ tag: 'timer-123' })
      );
    });

    it('iconオプションが渡される', () => {
      mockNotificationPermission = 'granted';

      showNotification({
        title: 'タイマー完了',
        icon: '/icon.png',
      });

      expect(globalThis.Notification).toHaveBeenCalledWith(
        'タイマー完了',
        expect.objectContaining({ icon: '/icon.png' })
      );
    });
  });

  describe('flashTitle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      document.title = '元のタイトル';
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('タイトルを点滅させる', () => {
      const stop = flashTitle('タイマー完了！', '元のタイトル');

      expect(document.title).toBe('タイマー完了！');

      vi.advanceTimersByTime(1000);
      expect(document.title).toBe('元のタイトル');

      vi.advanceTimersByTime(1000);
      expect(document.title).toBe('タイマー完了！');

      stop();
    });

    it('停止関数を呼ぶと点滅が止まる', () => {
      const stop = flashTitle('タイマー完了！', '元のタイトル');

      stop();

      expect(document.title).toBe('元のタイトル');

      // 停止後はタイトルが変わらないことを確認
      vi.advanceTimersByTime(2000);
      expect(document.title).toBe('元のタイトル');
    });

    it('停止後に元のタイトルに戻る', () => {
      document.title = 'オリジナルタイトル';
      const stop = flashTitle('通知メッセージ', 'オリジナルタイトル');

      vi.advanceTimersByTime(500);
      stop();

      expect(document.title).toBe('オリジナルタイトル');
    });
  });
});
