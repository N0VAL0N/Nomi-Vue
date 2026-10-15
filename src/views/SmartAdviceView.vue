<!-- src/views/SmartAdviceView.vue -->
<template>
  <div class="advice-view">
    <div class="title">💡 Советы Номи</div>
    <div class="subtitle">Анализ твоих данных</div>

    <div v-if="smart.suggestions.length === 0" class="empty">
      <div class="empty-icon">✨</div>
      <div>Всё в порядке! Номи молчит.</div>
    </div>

    <div v-else class="list">
      <div
        v-for="s in smart.suggestions"
        :key="s.id"
        v-ripple
        class="advice-card"
        @click="goTo(s.actionRoute)"
      >
        <div class="advice-icon">{{ s.icon }}</div>
        <div class="advice-body">
          <div class="advice-title">{{ s.title }}</div>
          <div class="advice-text">{{ s.body }}</div>
        </div>
        <AppIcon name="back" :size="16" class="advice-arrow" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSmartNotificationsStore } from '@/stores/smartNotifications'
import { vRipple } from '@/directives/ripple'
import AppIcon from '@/components/ui/AppIcon.vue'

const router = useRouter()
const smart = useSmartNotificationsStore()

function goTo(route?: string) {
  if (route) router.push(route)
}
</script>

<style scoped>
.advice-view { padding: 16px; max-width: 720px; margin: 0 auto; }
.title { font-size: 1.2rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
.subtitle { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px; }

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}
.empty-icon { font-size: 3rem; margin-bottom: 12px; }

.list { display: flex; flex-direction: column; gap: 10px; }

.advice-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1.5px solid var(--border-soft);
  cursor: pointer;
  transition: transform 0.15s;
}

.advice-card:active { transform: scale(0.98); }

.advice-icon {
  font-size: 1.6rem;
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.advice-body { flex: 1; min-width: 0; }

.advice-title {
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--text);
}

.advice-text {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

.advice-arrow {
  transform: rotate(180deg);
  color: var(--text-dim);
  flex-shrink: 0;
}
</style>