<script lang="ts">
  interface Props {
    seconds: number;
  }

  let { seconds }: Props = $props();

  function formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<div
  data-testid="timer-display"
  class="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-lavender-700 text-center py-4"
>
  {formatTime(seconds)}
</div>
