<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  let isOpen = $state(false);

  function toggle() {
    isOpen = !isOpen;
  }

  function close() {
    isOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      close();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative">
  <button
    data-testid="hamburger-menu-button"
    onclick={toggle}
    aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
    aria-expanded={isOpen}
    class="p-2 rounded-lg bg-lavender-200 hover:bg-lavender-300 text-lavender-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      {#if isOpen}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      {:else}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      {/if}
    </svg>
  </button>

  {#if isOpen}
    <!-- Backdrop -->
    <button
      data-testid="hamburger-menu-backdrop"
      class="fixed inset-0 bg-black/20 z-40"
      onclick={handleBackdropClick}
      aria-label="メニューを閉じる"
    ></button>

    <!-- Menu Panel -->
    <div
      data-testid="hamburger-menu-panel"
      class="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
    >
      {@render children()}
    </div>
  {/if}
</div>
