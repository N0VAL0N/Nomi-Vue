<!-- src/views/ToolsView.vue -->
<template>
  <div class="tools-view">
    <div class="title">🛠 Мастерская</div>
    <div class="subtitle">Инструменты для работы</div>

    <div class="hub-grid">
      <RouterLink to="/timer" class="hub-card" v-ripple>
        <div class="hub-icon">
          <AppIcon name="clock" :size="36" />
        </div>
        <div class="hub-info">
          <div class="hub-name">Таймер</div>
          <div class="hub-desc">Помодоро 25/5</div>
        </div>
      </RouterLink>

      <!-- Заглушки для будущих инструментов -->
      <div class="hub-card disabled">
        <div class="hub-icon">
          <AppIcon name="list" :size="36" />
        </div>
        <div class="hub-info">
          <div class="hub-name">Заметки</div>
          <div class="hub-desc">Скоро</div>
        </div>
      </div>

      <div class="hub-card disabled">
        <div class="hub-icon">
          <AppIcon name="brain" :size="36" />
        </div>
        <div class="hub-info">
          <div class="hub-name">Фокус-режим</div>
          <div class="hub-desc">Скоро</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { vRipple } from '@/directives/ripple'
</script>

<style scoped>
.tools-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 4px;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.hub-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hub-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius);
  background: var(--grad-card);
  border: 1px solid var(--border-soft);
  color: var(--text);
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s;
}

.hub-card:active {
  transform: scale(0.98);
}

.hub-card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.hub-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A78BFA;
  flex-shrink: 0;
}

.hub-info { flex: 1; min-width: 0; }

.hub-name {
  font-weight: 800;
  font-size: 1rem;
}

.hub-desc {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 4px;
  font-weight: 600;
}
</style>