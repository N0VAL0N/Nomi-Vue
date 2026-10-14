// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Capacitor } from '@capacitor/core'
import { SystemBars } from '@capacitor/core'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { vRipple } from './directives/ripple'

// Скрываем системные бары только на нативной платформе (Android/iOS)
if (Capacitor.isNativePlatform()) {
  SystemBars.hide().catch(() => {
    // silent — не критично, если не сработает
  })
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
app.directive('ripple', vRipple)