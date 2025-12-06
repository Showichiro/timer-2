/**
 * Vibration APIによる触覚通知ユーティリティ
 */

/**
 * Vibration APIがサポートされているかを確認する
 */
export function isVibrationSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * バイブレーションを実行する
 * @param pattern バイブレーションパターン（ミリ秒）。単一の数値または配列
 * @returns バイブレーションの成功/失敗（非対応デバイスはfalse）
 */
export function vibrate(pattern: number | number[] = 200): boolean {
  if (!isVibrationSupported()) {
    return false;
  }
  return navigator.vibrate(pattern);
}
