import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import SettingsPanel from './SettingsPanel.svelte';

// モジュール全体をモック
vi.mock('./notification', () => ({
  getPermissionStatus: vi.fn(() => 'default'),
  requestPermission: vi.fn(() => Promise.resolve('granted'))
}));

vi.mock('./storage', () => ({
  loadSettings: vi.fn(() => ({ soundEnabled: true })),
  saveSettings: vi.fn()
}));

// モックされたモジュールをインポート
import * as notification from './notification';
import * as storage from './storage';

describe('SettingsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルト値をリセット
    vi.mocked(notification.getPermissionStatus).mockReturnValue('default');
    vi.mocked(notification.requestPermission).mockResolvedValue('granted');
    vi.mocked(storage.loadSettings).mockReturnValue({ soundEnabled: true });
  });

  afterEach(() => {
    cleanup();
  });

  describe('レンダリング', () => {
    it('設定パネルを表示する', () => {
      const { getByTestId } = render(SettingsPanel);
      expect(getByTestId('settings-panel')).toBeTruthy();
    });

    it('通知音トグルスイッチを表示する', () => {
      const { getByTestId } = render(SettingsPanel);
      expect(getByTestId('sound-toggle')).toBeTruthy();
    });

    it('通知許可ボタンを表示する', () => {
      const { getByTestId } = render(SettingsPanel);
      expect(getByTestId('notification-permission-button')).toBeTruthy();
    });

    it('現在の許可ステータスを表示する', () => {
      const { getByTestId } = render(SettingsPanel);
      expect(getByTestId('permission-status')).toBeTruthy();
    });
  });

  describe('通知音トグル', () => {
    it('soundEnabledがtrueの場合、トグルはオンになっている', () => {
      vi.mocked(storage.loadSettings).mockReturnValue({ soundEnabled: true });
      const { getByTestId } = render(SettingsPanel);
      const toggle = getByTestId('sound-toggle') as HTMLInputElement;
      expect(toggle.checked).toBe(true);
    });

    it('soundEnabledがfalseの場合、トグルはオフになっている', () => {
      vi.mocked(storage.loadSettings).mockReturnValue({ soundEnabled: false });
      const { getByTestId } = render(SettingsPanel);
      const toggle = getByTestId('sound-toggle') as HTMLInputElement;
      expect(toggle.checked).toBe(false);
    });

    it('トグルをクリックするとsaveSettingsが呼ばれる', async () => {
      const { getByTestId } = render(SettingsPanel);
      const toggle = getByTestId('sound-toggle');
      await fireEvent.click(toggle);
      expect(storage.saveSettings).toHaveBeenCalled();
    });

    it('トグルをクリックするとonSettingsChangeが呼ばれる', async () => {
      const onSettingsChange = vi.fn();
      const { getByTestId } = render(SettingsPanel, {
        props: { onSettingsChange }
      });
      const toggle = getByTestId('sound-toggle');
      await fireEvent.click(toggle);
      expect(onSettingsChange).toHaveBeenCalled();
    });
  });

  describe('通知許可', () => {
    it('許可ステータスが"default"の場合、ボタンが有効になっている', () => {
      vi.mocked(notification.getPermissionStatus).mockReturnValue('default');
      const { getByTestId } = render(SettingsPanel);
      const button = getByTestId('notification-permission-button') as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });

    it('許可ステータスが"granted"の場合、ボタンが無効になっている', () => {
      vi.mocked(notification.getPermissionStatus).mockReturnValue('granted');
      const { getByTestId } = render(SettingsPanel);
      const button = getByTestId('notification-permission-button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('許可ステータスが"denied"の場合、ボタンが無効になっている', () => {
      vi.mocked(notification.getPermissionStatus).mockReturnValue('denied');
      const { getByTestId } = render(SettingsPanel);
      const button = getByTestId('notification-permission-button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('許可ボタンをクリックするとrequestPermissionが呼ばれる', async () => {
      vi.mocked(notification.getPermissionStatus).mockReturnValue('default');
      vi.mocked(notification.requestPermission).mockResolvedValue('granted');
      const { getByTestId } = render(SettingsPanel);
      const button = getByTestId('notification-permission-button');
      await fireEvent.click(button);
      expect(notification.requestPermission).toHaveBeenCalled();
    });

    it('許可ステータスが"granted"の場合、"許可済み"と表示する', () => {
      vi.mocked(notification.getPermissionStatus).mockReturnValue('granted');
      const { getByTestId } = render(SettingsPanel);
      const status = getByTestId('permission-status');
      expect(status.textContent).toContain('許可済み');
    });

    it('許可ステータスが"denied"の場合、"拒否"と表示する', () => {
      vi.mocked(notification.getPermissionStatus).mockReturnValue('denied');
      const { getByTestId } = render(SettingsPanel);
      const status = getByTestId('permission-status');
      expect(status.textContent).toContain('拒否');
    });

    it('許可ステータスが"default"の場合、"未設定"と表示する', () => {
      vi.mocked(notification.getPermissionStatus).mockReturnValue('default');
      const { getByTestId } = render(SettingsPanel);
      const status = getByTestId('permission-status');
      expect(status.textContent).toContain('未設定');
    });
  });

  describe('アクセシビリティ', () => {
    it('トグルスイッチにaria-labelが設定されている', () => {
      const { getByTestId } = render(SettingsPanel);
      const toggle = getByTestId('sound-toggle');
      expect(toggle.getAttribute('aria-label')).toBe('通知音のオン/オフ');
    });

    it('許可ボタンにaria-labelが設定されている', () => {
      const { getByTestId } = render(SettingsPanel);
      const button = getByTestId('notification-permission-button');
      expect(button.getAttribute('aria-label')).toBeTruthy();
    });
  });
});
