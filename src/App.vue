<!-- src/App.vue -->
<template>
  <template v-if="!user.onboarded">
    <OnboardingView />
  </template>
  <template v-else>
    <div class="bg-layer" :class="`bg-${bg.theme}`" />
    <ParticlesLayer />   <!-- ← вот это -->

    <AppTopbar />
    <main class="app-main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppBottomNav />
    <NomiFab />
  </template>

  <ToastHost />
  <PremiumModal />
  <PaymentModal />
  <NomiChat />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppBottomNav from '@/components/layout/AppBottomNav.vue'
import NomiFab from '@/components/layout/NomiFab.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
import PremiumModal from '@/components/premium/PremiumModal.vue'
import PaymentModal from '@/components/premium/PaymentModal.vue'
import NomiChat from '@/components/chat/NomiChat.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import { useAppInit } from '@/composables/useAppInit'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'
import { useAchievementsStore } from '@/stores/achievements'
import { useBackgroundStore } from '@/stores/background'
import { useNotifications } from '@/composables/useNotifications'
import { useRemindersStore } from '@/stores/reminders'

const user = useUserStore()
const ui = useUiStore()
const achievements = useAchievementsStore()
const bg = useBackgroundStore()
const notifications = useNotifications()
const reminders = useRemindersStore()

const { load, startAutoSave } = useAppInit()

load()
startAutoSave()

let achievementsTimer: ReturnType<typeof setInterval> | null = null

function onScroll() {
  const el = document.documentElement
  bg.updateScroll(el.scrollTop, el.scrollHeight - el.clientHeight)
}

onMounted(async () => {
  achievements.check()
  achievementsTimer = setInterval(() => achievements.check(), 60000)

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Восстанавливаем напоминания
  if (ui.notifications && reminders.items.length > 0) {
    await notifications.scheduleAllReminders(reminders.items)
  }
})

onUnmounted(() => {
  if (achievementsTimer) clearInterval(achievementsTimer)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: var(--bg);
  transition: background 0.8s ease;
  pointer-events: none;
}

.bg-layer.bg-default {
  background: var(--bg);
  background-image:
    radial-gradient(circle at 20% 0%, rgba(124, 58, 237, 0.15), transparent 40%),
    radial-gradient(circle at 80% 100%, rgba(99, 102, 241, 0.12), transparent 40%);
}
.bg-layer.bg-forest {
  background:
    radial-gradient(circle at 20% 0%, rgba(34, 197, 94, 0.15), transparent 40%),
    radial-gradient(circle at 80% 100%, rgba(16, 185, 129, 0.12), transparent 40%),
    var(--bg);
}
.bg-layer.bg-stars {
  background: radial-gradient(circle at 30% 20%, #1E1B4B, #05040F 70%);
}
.bg-layer.bg-sunset {
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.35) 0%, rgba(236, 72, 153, 0.35) 40%, rgba(124, 58, 237, 0.4) 80%, var(--bg) 100%);
}
.bg-layer.bg-ocean {
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.3) 0%, rgba(14, 165, 233, 0.3) 40%, rgba(3, 105, 161, 0.4) 80%, var(--bg) 100%);
}

.app-main {
  padding: 12px 12px 110px;
  min-height: 100vh;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>