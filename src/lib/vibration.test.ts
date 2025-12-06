import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { vibrate, isVibrationSupported } from './vibration';

describe('vibration', () => {
  let originalVibrate: typeof navigator.vibrate | undefined;

  beforeEach(() => {
    originalVibrate = navigator.vibrate;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Restore original vibrate function
    Object.defineProperty(navigator, 'vibrate', {
      value: originalVibrate,
      writable: true,
      configurable: true
    });
  });

  describe('isVibrationSupported', () => {
    it('Vibration APIが利用可能な場合trueを返す', () => {
      const mockVibrate = vi.fn(() => true);
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
        writable: true,
        configurable: true
      });

      expect(isVibrationSupported()).toBe(true);
    });

    // Note: ブラウザ環境ではnavigator.vibrateの削除が難しいため、
    // 実際の非対応デバイスのテストは統合テストで確認する
  });

  describe('vibrate', () => {
    it('デフォルトパターン（200ms）でバイブレーションを実行する', () => {
      const mockVibrate = vi.fn(() => true);
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
        writable: true,
        configurable: true
      });

      const result = vibrate();

      expect(mockVibrate).toHaveBeenCalledWith(200);
      expect(result).toBe(true);
    });

    it('カスタム数値パターンでバイブレーションを実行する', () => {
      const mockVibrate = vi.fn(() => true);
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
        writable: true,
        configurable: true
      });

      const result = vibrate(500);

      expect(mockVibrate).toHaveBeenCalledWith(500);
      expect(result).toBe(true);
    });

    it('配列パターンでバイブレーションを実行する', () => {
      const mockVibrate = vi.fn(() => true);
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
        writable: true,
        configurable: true
      });

      const pattern = [200, 100, 200];
      const result = vibrate(pattern);

      expect(mockVibrate).toHaveBeenCalledWith(pattern);
      expect(result).toBe(true);
    });

    it('navigator.vibrateがfalseを返す場合falseを返す', () => {
      const mockVibrate = vi.fn(() => false);
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
        writable: true,
        configurable: true
      });

      const result = vibrate();

      expect(result).toBe(false);
    });
  });
});
