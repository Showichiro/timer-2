import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { announceToScreenReader, type AriaLiveLevel } from './a11y';

// 次のアニメーションフレームを待つヘルパー
function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

describe('a11y', () => {
  beforeEach(() => {
    // ライブリージョン要素をクリーンアップ
    document.querySelectorAll('[aria-live]').forEach(el => el.remove());
  });

  afterEach(() => {
    document.querySelectorAll('[aria-live]').forEach(el => el.remove());
  });

  describe('announceToScreenReader', () => {
    it('politeレベルでメッセージをアナウンスする', async () => {
      announceToScreenReader('タイマーが開始しました');
      await nextFrame();

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).not.toBeNull();
      expect(liveRegion?.textContent).toBe('タイマーが開始しました');
    });

    it('assertiveレベルでメッセージをアナウンスする', async () => {
      announceToScreenReader('タイマーが完了しました', 'assertive');
      await nextFrame();

      const liveRegion = document.querySelector('[aria-live="assertive"]');
      expect(liveRegion).not.toBeNull();
      expect(liveRegion?.textContent).toBe('タイマーが完了しました');
    });

    it('デフォルトでpoliteレベルを使用する', () => {
      announceToScreenReader('テストメッセージ');

      const politeRegion = document.querySelector('[aria-live="polite"]');
      expect(politeRegion).not.toBeNull();
    });

    it('ライブリージョン要素にaria-atomic属性が設定されている', () => {
      announceToScreenReader('テストメッセージ');

      const liveRegion = document.querySelector('[aria-live]');
      expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');
    });

    it('ライブリージョン要素が視覚的に非表示である', () => {
      announceToScreenReader('テストメッセージ');

      const liveRegion = document.querySelector('[aria-live]') as HTMLElement;
      expect(liveRegion).not.toBeNull();
      // sr-only相当のスタイルが適用されていることを確認
      expect(liveRegion.style.position).toBe('absolute');
      expect(liveRegion.style.width).toBe('1px');
      expect(liveRegion.style.height).toBe('1px');
      expect(liveRegion.style.overflow).toBe('hidden');
    });

    it('連続してアナウンスした場合、最新のメッセージが表示される', async () => {
      announceToScreenReader('最初のメッセージ');
      announceToScreenReader('2番目のメッセージ');
      await nextFrame();

      const liveRegions = document.querySelectorAll('[aria-live="polite"]');
      // 同じレベルのライブリージョンは1つだけ存在
      expect(liveRegions.length).toBe(1);
      expect(liveRegions[0].textContent).toBe('2番目のメッセージ');
    });

    it('異なるレベルのアナウンスは別々のライブリージョンを使用する', async () => {
      announceToScreenReader('politeメッセージ', 'polite');
      announceToScreenReader('assertiveメッセージ', 'assertive');
      await nextFrame();

      const politeRegion = document.querySelector('[aria-live="polite"]');
      const assertiveRegion = document.querySelector('[aria-live="assertive"]');

      expect(politeRegion?.textContent).toBe('politeメッセージ');
      expect(assertiveRegion?.textContent).toBe('assertiveメッセージ');
    });
  });
});
