import type { TimerData } from './types';

export const STORAGE_KEY = 'timer-app-timers';

/**
 * ローカルストレージからタイマーデータを読み込む
 * データが存在しない場合やパースエラー時はデフォルトタイマーを返す
 */
export function loadTimers(): TimerData[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return getDefaultTimers();
  }
  try {
    return JSON.parse(data) as TimerData[];
  } catch {
    return getDefaultTimers();
  }
}

/**
 * タイマーデータをローカルストレージに保存する
 */
export function saveTimers(timers: TimerData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
}

/**
 * デフォルトのタイマーを生成する
 */
function getDefaultTimers(): TimerData[] {
  return [{
    id: crypto.randomUUID(),
    name: 'タイマー 1',
    initialHours: 0,
    initialMinutes: 5,
    initialSeconds: 0
  }];
}
