<script lang="ts">
  import type { TimerData, AppSettings } from './lib/types';
  import TimerCard from './lib/TimerCard.svelte';
  import SettingsPanel from './lib/SettingsPanel.svelte';
  import HamburgerMenu from './lib/HamburgerMenu.svelte';
  import { loadTimers, saveTimers, loadSettings } from './lib/storage';
  import { dndzone } from 'svelte-dnd-action';

  // svelte-dnd-action用の拡張型（idが必須）
  type DndItem = TimerData & { id: string };

  let timers: DndItem[] = $state(loadTimers());
  let settings: AppSettings = $state(loadSettings());

  $effect(() => {
    saveTimers(timers);
  });

  function handleSettingsChange(newSettings: AppSettings) {
    settings = newSettings;
  }

  function addTimer() {
    const newTimer: DndItem = {
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

  // ドラッグ&ドロップイベントハンドラ
  function handleDndConsider(e: CustomEvent<{ items: DndItem[] }>) {
    timers = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<{ items: DndItem[] }>) {
    timers = e.detail.items;
  }
</script>

<main class="min-h-screen bg-lavender-100 p-4 md:p-8">
  <header class="mb-6">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-bold text-lavender-800">タイマーアプリ</h1>
      <HamburgerMenu>
        <SettingsPanel onSettingsChange={handleSettingsChange} />
      </HamburgerMenu>
    </div>
  </header>

  <div
    data-testid="timer-grid"
    data-dnd-zone="true"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto"
    use:dndzone={{ items: timers }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
  >
    {#each timers as timer (timer.id)}
      <div draggable="true">
        <TimerCard
          {timer}
          onUpdate={updateTimer}
          onDelete={deleteTimer}
        />
      </div>
    {/each}
  </div>

  <div class="flex justify-center mt-6">
    <button
      data-testid="add-timer-button"
      onclick={addTimer}
      aria-label="新しいタイマーを追加"
      class="bg-lavender-500 hover:bg-lavender-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      タイマーを追加
    </button>
  </div>
</main>
