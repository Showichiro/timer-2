/**
 * Web Audio APIを使用したアラーム音再生ユーティリティ
 */

let audioContext: AudioContext | null = null;

/**
 * AudioContextのシングルトンインスタンスを取得する
 */
export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * AudioContextをリセットする（テスト用）
 */
export function resetAudioContext(): void {
  audioContext = null;
}

interface PlayAlarmOptions {
  /** 再生時間（ミリ秒） */
  duration?: number;
  /** 周波数（Hz） */
  frequency?: number;
  /** 音量（0-1） */
  volume?: number;
}

/**
 * アラーム音を再生する
 */
export function playAlarm(options: PlayAlarmOptions = {}): void {
  const { duration = 500, frequency = 800, volume = 0.5 } = options;

  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = Math.max(0, Math.min(1, volume));

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
}
