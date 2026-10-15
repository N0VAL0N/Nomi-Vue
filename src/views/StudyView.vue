<!-- src/views/StudyView.vue -->
<template>
  <div class="study-view">
    <div class="title">Учёба</div>

    <div class="hub-grid">
      <RouterLink to="/topics" class="hub-card">
        <AppIcon name="book" :size="28" />
        <div class="hub-name">Уроки</div>
        <div class="hub-desc">{{ topicsCount }} тем</div>
      </RouterLink>

      <RouterLink to="/schedule" class="hub-card">
        <AppIcon name="calendar" :size="28" />
        <div class="hub-name">Расписание</div>
        <div class="hub-desc">6 дней</div>
      </RouterLink>

      <RouterLink to="/hw" class="hub-card">
        <AppIcon name="list" :size="28" />
        <div class="hub-name">Домашка</div>
        <div class="hub-desc">{{ hwPending }} в работе</div>
      </RouterLink>

      <RouterLink to="/checklist" class="hub-card">
        <AppIcon name="check" :size="28" />
        <div class="hub-name">Чек-лист</div>
        <div class="hub-desc">{{ taskPending }} задач</div>
      </RouterLink>

      <RouterLink to="/flash" class="hub-card">
        <AppIcon name="card" :size="28" />
        <div class="hub-name">Карточки</div>
        <div class="hub-desc">{{ flashCount }} шт.</div>
      </RouterLink>

      <RouterLink to="/fridge" class="hub-card">
        <AppIcon name="snowflake" :size="28" />
        <div class="hub-name">Холодильник</div>
        <div class="hub-desc">SRS</div>
      </RouterLink>

      <RouterLink to="/errors" class="hub-card">
        <AppIcon name="target" :size="28" />
        <div class="hub-name">Дневник ошибок</div>
        <div class="hub-desc">{{ errorCount }} проблем</div>
      </RouterLink>

      <RouterLink to="/advice" class="hub-card">
        <AppIcon name="sparkles" :size="28" />
        <div class="hub-name">Советы Номи</div>
        <div class="hub-desc">{{ adviceCount }} рекомендаций</div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { getAllTopics } from '@/data/topics'
import { useHomeworkStore } from '@/stores/homework'
import { useChecklistStore } from '@/stores/checklist'
import { useFlashStore } from '@/stores/flash'
import { useUserStore } from '@/stores/user'
import { useSmartNotificationsStore } from '@/stores/smartNotifications'

const hw = useHomeworkStore()
const cl = useChecklistStore()
const flash = useFlashStore()
const user = useUserStore()
const errorCount = computed(() => user.unsolvedErrors.length)

const topicsCount = computed(() => getAllTopics().length)
const hwPending = computed(() => hw.pending.length)
const taskPending = computed(() => cl.pending.length)
const flashCount = computed(() => flash.cards.length)
const smart = useSmartNotificationsStore()
const adviceCount = computed(() => smart.suggestions.length)

</script>

<style scoped>
.study-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 16px;
}

.hub-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.hub-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 16px;
  border-radius: var(--radius);
  background: var(--grad-card);
  border: 1px solid var(--border-soft);
  color: var(--text);
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s;
}

.hub-card:active {
  transform: scale(0.97);
  border-color: var(--primary);
}

.hub-card :deep(svg) {
  color: #A78BFA;
}

.hub-name {
  font-size: 0.95rem;
  font-weight: 800;
}

.hub-desc {
  font-size: 0.72rem;
  color: var(--text-secondary);
  font-weight: 600;
}
</style>