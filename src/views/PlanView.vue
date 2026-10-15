<!-- src/views/PlanView.vue -->
<template>
  <div class="plan-view">
    <div class="title">📋 План на 7 дней</div>

    <!-- Пустой план -->
    <div v-if="plan.days.length === 0" class="empty">
      <div class="empty-icon">🗺</div>
      <div class="empty-title">План не создан</div>
      <div class="empty-sub">Соберём план из твоих ошибок и слабых тем</div>
      <button v-ripple class="btn-gold" @click="generate">✨ Сгенерировать план</button>
    </div>

    <!-- Есть план -->
    <div v-else class="plan-content">
      <!-- Прогресс -->
      <div class="progress-card">
        <div class="progress-head">
          <span>ПРОГРЕСС ПЛАНА</span>
          <span class="progress-pct">{{ plan.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: plan.progress + '%' }" />
        </div>
        <div class="progress-label">
          {{ doneCount }} из {{ plan.days.length }} дней
        </div>
      </div>

      <!-- Дни -->
      <div class="days-list">
        <div
          v-for="(d, i) in plan.days"
          :key="d.date"
          class="day-card"
          :class="{
            done: d.done,
            today: d.date === today
          }"
        >
          <div class="day-head">
            <div class="day-num">
              <span class="day-label">День {{ i + 1 }}</span>
              <span class="day-date">{{ formatDate(d.date) }}</span>
            </div>
            <div v-if="d.done" class="day-check">✅</div>
            <div v-else-if="d.date === today" class="day-today">Сегодня</div>
          </div>

          <div class="day-topic">{{ d.topicTitle }}</div>
          <div class="day-subject">{{ d.subject }}</div>

          <div v-if="d.done && d.testScore !== null" class="day-score">
            🧪 Тест: {{ d.testScore }} / 5
          </div>

          <button
            v-if="!d.done && d.topicId"
            v-ripple
            class="day-btn"
            @click="goToTopic(d.topicId!)"
          >
            {{ d.date === today ? '▶ Начать' : 'Открыть тему' }}
          </button>
        </div>
      </div>

      <!-- Кнопки управления -->
      <button v-ripple class="btn-outline" @click="confirmRegenerate">
        🔄 Пересобрать план
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanStore } from '@/stores/plan'
import { useToast } from '@/composables/useToast'
import { todayISO, formatDate } from '@/utils/date'
import { vRipple } from '@/directives/ripple'

const router = useRouter()
const plan = usePlanStore()
const toast = useToast()

const today = todayISO()

const doneCount = computed(() => plan.days.filter((d) => d.done).length)

function generate() {
  plan.generate()
  if (plan.days.length === 0) {
    toast.warning('Нет тем для плана')
    return
  }
  toast.success('🎉 План собран!')
}

function confirmRegenerate() {
  if (!confirm('Пересобрать план? Прогресс сбросится.')) return
  generate()
}

function goToTopic(id: string) {
  router.push({ name: 'topic', params: { id } })
}
</script>

<style scoped>
.plan-view {
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

/* Empty */
.empty {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon { font-size: 3.5rem; margin-bottom: 12px; }
.empty-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 6px;
}
.empty-sub {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.btn-gold {
  padding: 14px 24px;
  border-radius: var(--radius-sm);
  background: var(--grad-gold);
  color: #0A1930;
  font-weight: 800;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
}

/* Plan content */
.plan-content { display: flex; flex-direction: column; gap: 12px; }

.progress-card {
  padding: 14px 16px;
  border-radius: var(--radius);
  background: var(--grad-card);
  border: 1px solid var(--border-soft);
}
.progress-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text);
  letter-spacing: 0.03em;
  margin-bottom: 8px;
}
.progress-pct { color: var(--purple); font-weight: 800; }
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--border);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--grad-purple);
  border-radius: var(--radius-full);
  transition: width 0.8s ease;
}
.progress-label {
  text-align: right;
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 6px;
  font-weight: 600;
}

/* Days */
.days-list { display: flex; flex-direction: column; gap: 10px; }

.day-card {
  padding: 14px 16px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1.5px solid var(--border-soft);
  border-left: 4px solid var(--border);
  transition: all 0.2s;
}

.day-card.done {
  border-left-color: var(--success);
  opacity: 0.7;
}

.day-card.today {
  border-left-color: var(--warning);
  box-shadow: 0 0 0 1px var(--warning);
}

.day-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.day-num {
  display: flex;
  align-items: center;
  gap: 8px;
}

.day-label {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--purple);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.day-date {
  font-size: 0.72rem;
  color: var(--text-dim);
  font-weight: 600;
}

.day-check { font-size: 1.2rem; }

.day-today {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: rgba(251, 191, 36, 0.15);
  color: var(--warning);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.day-topic {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.day-subject {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.day-score {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--success);
  margin-bottom: 10px;
}

.day-btn {
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

.btn-outline {
  padding: 14px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 8px;
}
</style>