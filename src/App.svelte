<script lang="ts">
  import type { TimerData } from './lib/types';
  import TimerCard from './lib/TimerCard.svelte';
  import { loadTimers, saveTimers } from './lib/storage';

  let timers: TimerData[] = $state(loadTimers());

  $effect(() => {
    saveTimers(timers);
  });

  function addTimer() {
    const newTimer: TimerData = {
      id: crypto.randomUUID(),
      name: `タイマー ${timers.length + 1}`,
      initialHours: 0,
      initialMinutes: 5,
      initialSeconds: 0
    };
    timers = [...timers, newTimer];
  }

  function updateTimer(updatedTimer: TimerData) {
    timers = timers.map(t => t.id === updatedTimer.id ? updatedTimer : t);
  }

  function deleteTimer(id: string) {
    timers = timers.filter(t => t.id !== id);
  }
</script>

<main class="min-h-screen bg-lavender-100 p-4 md:p-8">
  <header class="mb-6 text-center">
    <h1 class="text-2xl md:text-3xl font-bold text-lavender-800">タイマーアプリ</h1>
  </header>

  <div data-testid="timer-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
    {#each timers as timer (timer.id)}
      <TimerCard
        {timer}
        onUpdate={updateTimer}
        onDelete={deleteTimer}
      />
    {/each}
  </div>

  <div class="flex justify-center mt-6">
    <button
      data-testid="add-timer-button"
      onclick={addTimer}
      class="bg-lavender-500 hover:bg-lavender-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      タイマーを追加
    </button>
  </div>
</main>
