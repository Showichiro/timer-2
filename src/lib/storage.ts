import type { TimerData, AppSettings } from './types';

export const STORAGE_KEY = 'timer-app-timers';
export const SETTINGS_KEY = 'timer-app-settings';

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

/**
 * デフォルトの設定を取得する
 */
function getDefaultSettings(): AppSettings {
  return {
    soundEnabled: true
  };
}

/**
 * ローカルストレージからアプリ設定を読み込む
 * データが存在しない場合やパースエラー時はデフォルト設定を返す
 */
export function loadSettings(): AppSettings {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) {
    return getDefaultSettings();
  }
  try {
    return JSON.parse(data) as AppSettings;
  } catch {
    return getDefaultSettings();
  }
}

/**
 * アプリ設定をローカルストレージに保存する
 */
export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
