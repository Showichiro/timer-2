<script lang="ts">
  type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

  interface Props {
    status: TimerStatus;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
  }

  let { status, onStart, onPause, onReset }: Props = $props();

  let showStartButton = $derived(status !== 'running');
</script>

<div class="flex justify-center gap-3 py-2" role="group" aria-label="タイマー操作">
  {#if showStartButton}
    <button
      data-testid="start-button"
      onclick={onStart}
      aria-label="タイマーを開始"
      class="px-6 py-2 rounded-lg bg-lavender-600 text-white font-medium hover:bg-lavender-700 active:bg-lavender-800 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2"
    >
      開始
    </button>
  {:else}
    <button
      data-testid="pause-button"
      onclick={onPause}
      aria-label="タイマーを一時停止"
      class="px-6 py-2 rounded-lg bg-lavender-500 text-white font-medium hover:bg-lavender-600 active:bg-lavender-700 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2"
    >
      一時停止
    </button>
  {/if}
  <button
    data-testid="reset-button"
    onclick={onReset}
    aria-label="タイマーをリセット"
    class="px-6 py-2 rounded-lg bg-lavender-200 text-lavender-800 font-medium hover:bg-lavender-300 active:bg-lavender-400 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2"
  >
    リセット
  </button>
</div>
