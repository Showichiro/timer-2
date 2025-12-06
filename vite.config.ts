import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(),tailwindcss()],
  test: {
   browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
      headless: true,
   },
  }
})
