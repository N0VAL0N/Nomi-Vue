import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',                    // ← ДОБАВИТЬ: важно для APK
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,                  // ← ДОБАВИТЬ: live-reload на телефоне по Wi-Fi
    port: 5173
  }
})