<!-- src/components/layout/AppTopbar.vue -->
<template>
  <header class="topbar glass">
    <RouterLink to="/" class="logo">
      <NomiAvatar :size="28" />
      <span class="logo-text">НОМИ</span>
    </RouterLink>

    <div class="topbar-right">
      <div class="pill">
        <AppIcon name="flame" :size="12" />
        <span>{{ user.streak }}</span>
      </div>
      <button v-ripple class="avatar-btn" @click="router.push('/profile')">
        <AppIcon name="user" :size="16" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AppIcon from '@/components/ui/AppIcon.vue'
import NomiAvatar from '@/components/nomi/NomiAvatar.vue'
import { vRipple } from '@/directives/ripple'

const user = useUserStore()
const router = useRouter()
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  margin: 8px 12px 0;
  border-radius: var(--radius-full);
  padding-top: calc(8px + env(safe-area-inset-top));
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-text {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: var(--grad-purple);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: var(--radius-full);
  background: var(--card-bg-2);
  border: 1px solid var(--border-soft);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text);
  animation: pillFloat 3s ease-in-out infinite;
}

@keyframes pillFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-2px); }
}

.avatar-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--grad-purple);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  flex-shrink: 0;
}
</style>