<!-- src/components/layout/AppBottomNav.vue -->
<template>
  <nav class="bottom-nav glass">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      v-ripple
      :to="item.to"
      class="nav-item"
      :class="{ active: isActive(item.to) }"
    >
      <div class="nav-icon-wrap">
        <AppIcon :name="item.icon" :size="22" />
        <div v-if="isActive(item.to)" class="nav-glow" />
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { vRipple } from '@/directives/ripple'

const items = [
  { to: '/',        icon: 'home',    label: 'Главная' },
  { to: '/study',   icon: 'book',    label: 'Учёба' },
  { to: '/tools',   icon: 'tools',   label: 'Мастерская' },
  { to: '/quests',  icon: 'target',  label: 'Путешествия' }
]

const route = useRoute()

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-around;
  padding: 8px 6px calc(8px + env(safe-area-inset-bottom));
  border-radius: var(--radius-full);
  z-index: 100;
  margin: 0 auto;
  max-width: 520px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 4px;
  color: var(--text-dim);
  text-decoration: none;
  font-weight: 700;
  border-radius: var(--radius-full);
  transition: color 0.25s;
  overflow: hidden;
  position: relative;
}

.nav-item.active {
  color: #A78BFA;
}

.nav-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.nav-item.active .nav-icon-wrap {
  transform: translateY(-2px) scale(1.08);
}

.nav-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.5) 0%, transparent 70%);
  z-index: -1;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%      { opacity: 1; transform: scale(1.15); }
}

.nav-label {
  font-size: 0.62rem;
  letter-spacing: 0.02em;
}
</style>