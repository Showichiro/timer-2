<script lang="ts">
  import type { TimerData, AppSettings } from './types';
  import TimerDisplay from './TimerDisplay.svelte';
  import TimerControls from './TimerControls.svelte';
  import TimeInput from './TimeInput.svelte';
  import { playAlarm } from './audio';
  import { vibrate } from './vibration';
  import { announceToScreenReader } from './a11y';
  import { showNotification, flashTitle } from './notification';

  type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

  interface Props {
    timer: TimerData;
    onUpdate: (timer: TimerData) => void;
    onDelete: (id: string) => void;
    settings?: AppSettings;
  }

  let { timer, onUpdate, onDelete, settings }: Props = $props();

  let status = $state<TimerStatus>('idle');
  let remainingSeconds: number = $state(0);
  let intervalId: number | null = $state(null);
  let isEditingName: boolean = $state(false);
  let editingName: string = $state('');

  // 初期時間を秒数に変換
  function calculateInitialSeconds(): number {
    return timer.initialHours * 3600 + timer.initialMinutes * 60 + timer.initialSeconds;
  }

  // マウント時に初期化
  $effect(() => {
    remainingSeconds = calculateInitialSeconds();
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  });

  // タイトル点滅の停止関数を保持
  let stopFlashTitle: (() => void) | null = $state(null);

  // ページがフォアグラウンドに戻った時に点滅を停止
  $effect(() => {
    function handleVisibilityChange() {
      if (!document.hidden && stopFlashTitle) {
        stopFlashTitle();
        stopFlashTitle = null;
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (stopFlashTitle) {
        stopFlashTitle();
        stopFlashTitle = null;
      }
    };
  });

  function focusTimerCard() {
    const card = document.querySelector(`[data-timer-id="${timer.id}"]`) as HTMLElement | null;
    if (card) {
      card.focus();
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // ウィンドウをフォアグラウンドに
    window.focus();
    // 点滅を停止
    if (stopFlashTitle) {
      stopFlashTitle();
      stopFlashTitle = null;
    }
  }

  function triggerCompletionNotifications() {
    // 設定に基づいて音声再生を制御
    const soundEnabled = settings?.soundEnabled ?? true;
    if (soundEnabled) {
      playAlarm();
    }
    vibrate([200, 100, 200]);
    announceToScreenReader(`${displayName}が完了しました`, 'assertive');

    // ブラウザ通知を表示
    showNotification({
      title: 'タイマー完了',
      body: `${displayName}が完了しました`,
      tag: `timer-${timer.id}`,
      onClick: focusTimerCard,
    });

    // タブがバックグラウンドの場合はタイトル点滅を開始
    if (document.hidden) {
      const originalTitle = document.title;
      stopFlashTitle = flashTitle(`⏰ ${displayName}が完了`, originalTitle);
    }
  }

  function start() {
    if (remainingSeconds <= 0) return;

    status = 'running';
    announceToScreenReader(`${displayName}を開始しました`);
    intervalId = setInterval(() => {
      remainingSeconds -= 1;
      if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        status = 'completed';
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
        triggerCompletionNotifications();
      }
    }, 1000);
  }

  function pause() {
    status = 'paused';
    announceToScreenReader(`${displayName}を一時停止しました`);
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    status = 'idle';
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    remainingSeconds = calculateInitialSeconds();
  }

  function handleHoursChange(value: number) {
    const updated = { ...timer, initialHours: value };
    onUpdate(updated);
    if (status === 'idle') {
      remainingSeconds = value * 3600 + timer.initialMinutes * 60 + timer.initialSeconds;
    }
  }

  function handleMinutesChange(value: number) {
    const updated = { ...timer, initialMinutes: value };
    onUpdate(updated);
    if (status === 'idle') {
      remainingSeconds = timer.initialHours * 3600 + value * 60 + timer.initialSeconds;
    }
  }

  function handleSecondsChange(value: number) {
    const updated = { ...timer, initialSeconds: value };
    onUpdate(updated);
    if (status === 'idle') {
      remainingSeconds = timer.initialHours * 3600 + timer.initialMinutes * 60 + value;
    }
  }

  let inputDisabled = $derived(status !== 'idle');

  // タイマー名（空の場合はデフォルト名を表示）
  let displayName = $derived(timer.name || 'タイマー 1');

  function startEditingName() {
    isEditingName = true;
    editingName = timer.name;
  }

  function confirmName() {
    isEditingName = false;
    const updated = { ...timer, name: editingName };
    onUpdate(updated);
  }

  function handleNameKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      confirmName();
    }
  }

  function handleDelete() {
    onDelete(timer.id);
  }

  let isCompleted = $derived(status === 'completed');
</script>

<div
  data-testid="timer-card"
  data-timer-id={timer.id}
  tabindex="-1"
  class="bg-lavender-50 border-2 border-lavender-200 rounded-xl p-4 shadow-md relative {isCompleted ? 'ring-4 ring-lavender-500 animate-pulse completed' : ''}"
>
  <button
    data-testid="delete-button"
    onclick={handleDelete}
    class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-lavender-200 text-lavender-700 hover:bg-lavender-300 hover:text-lavender-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2"
    aria-label="タイマーを削除"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <div class="mb-2 text-center">
    {#if isEditingName}
      <input
        type="text"
        data-testid="timer-name-input"
        bind:value={editingName}
        onblur={confirmName}
        onkeydown={handleNameKeyDown}
        aria-label="タイマー名を編集"
        class="text-lg font-semibold text-lavender-800 bg-white border-2 border-lavender-400 rounded px-2 py-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-1 focus-visible:border-lavender-600"
      />
    {:else}
      <button
        data-testid="timer-name"
        onclick={startEditingName}
        aria-label="タイマー名を変更するにはクリック"
        class="text-lg font-semibold text-lavender-800 hover:text-lavender-600 cursor-pointer bg-transparent border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2 rounded"
      >
        {displayName}
      </button>
    {/if}
  </div>

  <TimerDisplay seconds={remainingSeconds} />

  <TimeInput
    hours={timer.initialHours}
    minutes={timer.initialMinutes}
    seconds={timer.initialSeconds}
    disabled={inputDisabled}
    onHoursChange={handleHoursChange}
    onMinutesChange={handleMinutesChange}
    onSecondsChange={handleSecondsChange}
  />

  <TimerControls
    {status}
    onStart={start}
    onPause={pause}
    onReset={reset}
  />
</div>
