/**
 * 通知ユーティリティモジュール
 * ブラウザ通知とページタイトル点滅機能を提供
 */

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied';

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
  onClick?: () => void;
}

/**
 * 通知許可をリクエストする
 * @returns 許可ステータス
 */
export async function requestPermission(): Promise<NotificationPermissionStatus> {
  const result = await Notification.requestPermission();
  return result as NotificationPermissionStatus;
}

/**
 * 現在の許可ステータスを取得する
 * @returns 現在の許可ステータス
 */
export function getPermissionStatus(): NotificationPermissionStatus {
  return Notification.permission as NotificationPermissionStatus;
}

/**
 * 通知を表示する（許可されている場合）
 * @param options 通知オプション
 * @returns 通知インスタンス、許可がない場合はnull
 */
export function showNotification(options: NotificationOptions): Notification | null {
  if (Notification.permission !== 'granted') {
    return null;
  }

  const notification = new Notification(options.title, {
    body: options.body,
    icon: options.icon,
    tag: options.tag,
  });

  if (options.onClick) {
    notification.onclick = () => {
      options.onClick!();
      notification.close();
    };
  }

  return notification;
}

/**
 * ページタイトルを点滅させる
 * @param message 表示するメッセージ
 * @param originalTitle 元のタイトル
 * @returns 点滅を停止する関数
 */
export function flashTitle(message: string, originalTitle: string): () => void {
  let showMessage = true;
  document.title = message;

  const intervalId = setInterval(() => {
    showMessage = !showMessage;
    document.title = showMessage ? message : originalTitle;
  }, 1000);

  return () => {
    clearInterval(intervalId);
    document.title = originalTitle;
  };
}
