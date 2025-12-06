<script lang="ts">
  import type { AppSettings } from './types';
  import { loadSettings, saveSettings } from './storage';
  import { getPermissionStatus, requestPermission, type NotificationPermissionStatus } from './notification';

  interface Props {
    onSettingsChange?: (settings: AppSettings) => void;
  }

  let { onSettingsChange }: Props = $props();

  let settings: AppSettings = $state(loadSettings());
  let permissionStatus: NotificationPermissionStatus = $state(getPermissionStatus());

  function handleSoundToggle(event: Event) {
    const target = event.target as HTMLInputElement;
    settings = { ...settings, soundEnabled: target.checked };
    saveSettings(settings);
    onSettingsChange?.(settings);
  }

  async function handleRequestPermission() {
    const result = await requestPermission();
    permissionStatus = result;
  }

  function getPermissionStatusText(): string {
    switch (permissionStatus) {
      case 'granted':
        return '許可済み';
      case 'denied':
        return '拒否';
      default:
        return '未設定';
    }
  }

  let isPermissionButtonDisabled = $derived(permissionStatus !== 'default');
</script>

<div
  data-testid="settings-panel"
  class="bg-white p-4"
>
  <h2 class="text-lg font-semibold text-lavender-800 mb-4">設定</h2>

  <div class="space-y-4">
    <!-- 通知音設定 -->
    <div class="flex items-center justify-between">
      <label for="sound-toggle" class="text-lavender-700">通知音</label>
      <input
        id="sound-toggle"
        data-testid="sound-toggle"
        type="checkbox"
        checked={settings.soundEnabled}
        onchange={handleSoundToggle}
        aria-label="通知音のオン/オフ"
        class="w-5 h-5 text-lavender-600 bg-white border-lavender-300 rounded focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2"
      />
    </div>

    <!-- 通知許可設定 -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-lavender-700">ブラウザ通知</span>
        <span
          data-testid="permission-status"
          class="text-sm px-2 py-1 rounded {permissionStatus === 'granted' ? 'bg-green-100 text-green-700' : permissionStatus === 'denied' ? 'bg-red-100 text-red-700' : 'bg-lavender-100 text-lavender-600'}"
        >
          {getPermissionStatusText()}
        </span>
      </div>
      <button
        data-testid="notification-permission-button"
        onclick={handleRequestPermission}
        disabled={isPermissionButtonDisabled}
        aria-label="ブラウザ通知を許可する"
        class="w-full bg-lavender-500 hover:bg-lavender-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-lavender-300 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-700 focus-visible:ring-offset-2"
      >
        通知を許可する
      </button>
    </div>
  </div>
</div>
