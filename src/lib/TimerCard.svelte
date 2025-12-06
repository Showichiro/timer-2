<script lang="ts">
  import type { TimerData } from './types';
  import TimerDisplay from './TimerDisplay.svelte';
  import TimerControls from './TimerControls.svelte';
  import TimeInput from './TimeInput.svelte';
  import { playAlarm } from './audio';
  import { vibrate } from './vibration';

  type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

  interface Props {
    timer: TimerData;
    onUpdate: (timer: TimerData) => void;
    onDelete: (id: string) => void;
  }

  let { timer, onUpdate, onDelete }: Props = $props();

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

  function triggerCompletionNotifications() {
    playAlarm();
    vibrate([200, 100, 200]);
  }

  function start() {
    if (remainingSeconds <= 0) return;

    status = 'running';
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
  class="bg-lavender-50 border-2 border-lavender-200 rounded-xl p-4 shadow-md relative {isCompleted ? 'ring-4 ring-lavender-500 animate-pulse completed' : ''}"
>
  <button
    data-testid="delete-button"
    onclick={handleDelete}
    class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-lavender-200 text-lavender-700 hover:bg-lavender-300 hover:text-lavender-900 transition-colors"
    aria-label="削除"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        class="text-lg font-semibold text-lavender-800 bg-white border-2 border-lavender-400 rounded px-2 py-1 text-center focus:outline-none focus:border-lavender-600"
      />
    {:else}
      <button
        data-testid="timer-name"
        onclick={startEditingName}
        class="text-lg font-semibold text-lavender-800 hover:text-lavender-600 cursor-pointer bg-transparent border-none"
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
