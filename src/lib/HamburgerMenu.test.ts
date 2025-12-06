import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import HamburgerMenu from './HamburgerMenu.svelte';

// テスト用のラッパーコンポーネント
import { createRawSnippet } from 'svelte';

describe('HamburgerMenu', () => {
  afterEach(() => {
    cleanup();
  });

  describe('レンダリング', () => {
    it('ハンバーガーメニューボタンを表示する', () => {
      const { getByTestId } = render(HamburgerMenu, {
        props: {
          children: createRawSnippet(() => ({
            render: () => '<div>Menu Content</div>'
          }))
        }
      });
      expect(getByTestId('hamburger-menu-button')).toBeTruthy();
    });

    it('初期状態ではメニューパネルは非表示', () => {
      const { queryByTestId } = render(HamburgerMenu, {
        props: {
          children: createRawSnippet(() => ({
            render: () => '<div>Menu Content</div>'
          }))
        }
      });
      expect(queryByTestId('hamburger-menu-panel')).toBeNull();
    });
  });

  describe('メニュー開閉', () => {
    it('ボタンをクリックするとメニューパネルが表示される', async () => {
      const { getByTestId, queryByTestId } = render(HamburgerMenu, {
        props: {
          children: createRawSnippet(() => ({
            render: () => '<div>Menu Content</div>'
          }))
        }
      });

      const button = getByTestId('hamburger-menu-button');
      await fireEvent.click(button);

      expect(queryByTestId('hamburger-menu-panel')).toBeTruthy();
    });

    it('メニューが開いている時にボタンをクリックするとメニューが閉じる', async () => {
      const { getByTestId, queryByTestId } = render(HamburgerMenu, {
        props: {
          children: createRawSnippet(() => ({
            render: () => '<div>Menu Content</div>'
          }))
        }
      });

      const button = getByTestId('hamburger-menu-button');
      await fireEvent.click(button);
      expect(queryByTestId('hamburger-menu-panel')).toBeTruthy();

      await fireEvent.click(button);
      expect(queryByTestId('hamburger-menu-panel')).toBeNull();
    });

    it('バックドロップをクリックするとメニューが閉じる', async () => {
      const { getByTestId, queryByTestId } = render(HamburgerMenu, {
        props: {
          children: createRawSnippet(() => ({
            render: () => '<div>Menu Content</div>'
          }))
        }
      });

      const button = getByTestId('hamburger-menu-button');
      await fireEvent.click(button);

      const backdrop = getByTestId('hamburger-menu-backdrop');
      await fireEvent.click(backdrop);

      expect(queryByTestId('hamburger-menu-panel')).toBeNull();
    });
  });

  describe('アクセシビリティ', () => {
    it('ボタンにaria-labelが設定されている', () => {
      const { getByTestId } = render(HamburgerMenu, {
        props: {
          children: createRawSnippet(() => ({
            render: () => '<div>Menu Content</div>'
          }))
        }
      });
      const button = getByTestId('hamburger-menu-button');
      expect(button.getAttribute('aria-label')).toBe('メニューを開く');
    });

    it('メニューが開いている時aria-expandedがtrueになる', async () => {
      const { getByTestId } = render(HamburgerMenu, {
        props: {
          children: createRawSnippet(() => ({
            render: () => '<div>Menu Content</div>'
          }))
        }
      });

      const button = getByTestId('hamburger-menu-button');
      expect(button.getAttribute('aria-expanded')).toBe('false');

      await fireEvent.click(button);
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
