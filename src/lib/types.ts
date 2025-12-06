/**
 * タイマーデータの型定義
 */
export interface TimerData {
  id: string;
  name: string;
  initialHours: number;
  initialMinutes: number;
  initialSeconds: number;
}

/**
 * アプリ設定の型定義
 */
export interface AppSettings {
  soundEnabled: boolean;
}
