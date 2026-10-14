<!-- src/components/layout/AppTopbar.vue -->
<template>
  <header class="topbar glass">
    <RouterLink to="/" class="logo">
      <NomiAvatar :size="32" />
      <span class="logo-text">НОМИ</span>
    </RouterLink>

    <div class="topbar-right">
      <div class="pill">
        <AppIcon name="flame" :size="14" />
        <span>{{ user.streak }}</span>
      </div>
      <div class="pill">
        <AppIcon name="star" :size="14" />
        <span>{{ user.xp }}</span>
      </div>
      <button v-ripple class="icon-btn" @click="router.push('/shop')">
        <AppIcon name="cart" :size="18" />
      </button>
      <button v-ripple class="icon-btn" @click="router.push('/settings')">
        <AppIcon name="settings" :size="18" />
      </button>
      <button v-ripple class="avatar" @click="router.push('/profile')">
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
  padding: 10px 14px;
  margin: 8px 12px 0;
  border-radius: var(--radius-full);
  padding-top: calc(10px + env(safe-area-inset-top));
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-text {
  font-size: 1rem;
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
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text);
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--card-bg-2);
  border: 1px solid var(--border-soft);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.icon-btn:active { background: var(--card-bg); }

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--grad-purple);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}
</style>