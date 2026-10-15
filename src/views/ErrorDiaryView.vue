<!-- src/views/ErrorDiaryView.vue -->
<template>
  <div class="diary-view">
    <div class="title">Дневник ошибок</div>
    <div class="subtitle">
      {{ errors.length === 0 ? 'Пока чисто 🎉' : `Проблемных задач: ${errors.length}` }}
    </div>

    <div v-if="errors.length === 0" class="empty">
      <div class="empty-icon">✨</div>
      <div>Ошибок нет. Продолжай!</div>
    </div>

    <div v-else class="list">
      <div
        v-for="e in errors"
        :key="e.key"
        class="error-card"
      >
        <div class="error-head">
          <div class="error-topic">{{ e.data.topicTitle }}</div>
          <div class="error-badge">×{{ e.data.wrongCount }}</div>
        </div>
        <div class="error-question">{{ e.data.question }}</div>
        <div class="error-meta">
          Последняя попытка: {{ formatDate(e.data.lastTry) }}
        </div>
        <button v-ripple class="error-btn" @click="goToTopic(e.data.topicId)">
          🔄 Повторить тему
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/date'
import { vRipple } from '@/directives/ripple'

const router = useRouter()
const user = useUserStore()

const errors = computed(() => user.unsolvedErrors)

function goToTopic(topicId: string) {
  router.push({ name: 'topic', params: { id: topicId } })
}
</script>

<style scoped>
.diary-view {
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

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-card {
  padding: 14px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1.5px solid var(--border-soft);
  border-left: 4px solid var(--danger);
}

.error-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.error-topic {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--purple);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.error-badge {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  font-size: 0.72rem;
  font-weight: 800;
}

.error-question {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.5;
}

.error-meta {
  font-size: 0.72rem;
  color: var(--text-dim);
  margin-bottom: 10px;
}

.error-btn {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: var(--grad-purple);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
}
</style>