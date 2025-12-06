<script lang="ts">
  interface Props {
    hours: number;
    minutes: number;
    seconds: number;
    disabled: boolean;
    onHoursChange: (value: number) => void;
    onMinutesChange: (value: number) => void;
    onSecondsChange: (value: number) => void;
  }

  let {
    hours,
    minutes,
    seconds,
    disabled,
    onHoursChange,
    onMinutesChange,
    onSecondsChange
  }: Props = $props();

  function handleInput(
    e: Event & { currentTarget: HTMLInputElement },
    callback: (value: number) => void
  ) {
    const value = parseInt(e.currentTarget.value, 10) || 0;
    callback(value);
  }

  function handleHoursBlur() {
    const clamped = Math.max(0, Math.min(99, hours));
    if (clamped !== hours) {
      onHoursChange(clamped);
    }
  }

  function handleMinutesBlur() {
    const clamped = Math.max(0, Math.min(59, minutes));
    if (clamped !== minutes) {
      onMinutesChange(clamped);
    }
  }

  function handleSecondsBlur() {
    const clamped = Math.max(0, Math.min(59, seconds));
    if (clamped !== seconds) {
      onSecondsChange(clamped);
    }
  }

  const inputClass =
    'w-16 sm:w-20 text-center text-xl sm:text-2xl font-mono bg-lavender-100 border-2 border-lavender-300 rounded-lg py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-1 focus-visible:border-lavender-500 disabled:bg-lavender-50 disabled:text-lavender-400';
</script>

<div class="flex items-center justify-center gap-1 sm:gap-2 py-2">
  <input
    type="number"
    data-testid="hours-input"
    value={hours}
    min="0"
    max="99"
    {disabled}
    oninput={(e) => handleInput(e, onHoursChange)}
    onblur={handleHoursBlur}
    class={inputClass}
    aria-label="時間"
  />
  <span class="text-2xl font-bold text-lavender-600">:</span>
  <input
    type="number"
    data-testid="minutes-input"
    value={minutes}
    min="0"
    max="59"
    {disabled}
    oninput={(e) => handleInput(e, onMinutesChange)}
    onblur={handleMinutesBlur}
    class={inputClass}
    aria-label="分"
  />
  <span class="text-2xl font-bold text-lavender-600">:</span>
  <input
    type="number"
    data-testid="seconds-input"
    value={seconds}
    min="0"
    max="59"
    {disabled}
    oninput={(e) => handleInput(e, onSecondsChange)}
    onblur={handleSecondsBlur}
    class={inputClass}
    aria-label="秒"
  />
</div>
