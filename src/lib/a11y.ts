/**
 * アクセシビリティユーティリティモジュール
 * スクリーンリーダー向けのアナウンス機能を提供
 */

export type AriaLiveLevel = 'polite' | 'assertive';

// レベルごとのライブリージョン要素を管理
const liveRegions: Map<AriaLiveLevel, HTMLElement> = new Map();

/**
 * 視覚的に非表示だがスクリーンリーダーには読み上げられるスタイルを適用
 */
function applyScreenReaderOnlyStyles(element: HTMLElement): void {
  element.style.position = 'absolute';
  element.style.width = '1px';
  element.style.height = '1px';
  element.style.padding = '0';
  element.style.margin = '-1px';
  element.style.overflow = 'hidden';
  element.style.clip = 'rect(0, 0, 0, 0)';
  element.style.whiteSpace = 'nowrap';
  element.style.border = '0';
}

/**
 * 指定されたレベルのライブリージョン要素を取得または作成
 */
function getOrCreateLiveRegion(level: AriaLiveLevel): HTMLElement {
  let region = liveRegions.get(level);

  if (!region || !document.body.contains(region)) {
    region = document.createElement('div');
    region.setAttribute('aria-live', level);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', 'status');
    applyScreenReaderOnlyStyles(region);
    document.body.appendChild(region);
    liveRegions.set(level, region);
  }

  return region;
}

/**
 * スクリーンリーダーにメッセージをアナウンスする
 * @param message - アナウンスするメッセージ
 * @param level - アナウンスの優先度（'polite' または 'assertive'）。デフォルトは 'polite'
 */
export function announceToScreenReader(
  message: string,
  level: AriaLiveLevel = 'polite'
): void {
  const region = getOrCreateLiveRegion(level);

  // スクリーンリーダーが変更を検知できるよう、一度空にしてから設定
  region.textContent = '';

  // 非同期で設定することで確実に変更を検知させる
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}
