<!-- src/views/FridgeView.vue -->
<template>
  <div class="fridge-view">
    <div class="title">🧊 Холодильник (SRS)</div>

    <div v-if="fridge.items.length === 0" class="empty">🧊 Холодильник пуст</div>

    <div v-else class="list">
      <div
        v-for="f in fridge.items"
        :key="f.topicId"
        class="fridge-card"
        :class="{ due: isDue(f.nextReview) }"
      >
        <div class="fridge-icon">🧊</div>
        <div class="fridge-info">
          <div class="fridge-title">{{ f.title }}</div>
          <div class="fridge-meta">
            Уровень {{ f.level + 1 }} ·
            {{ isDue(f.nextReview) ? '📅 Пора повторить' : `Следующее: ${formatDate(f.nextReview)}` }}
          </div>
        </div>
        <button class="btn-review" @click="onReview(f.topicId)">Повторить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFridgeStore } from '@/stores/fridge'
import { useEconomy } from '@/composables/useEconomy'
import { useToast } from '@/composables/useToast'
import { todayISO, formatDate } from '@/utils/date'

const fridge = useFridgeStore()
const economy = useEconomy()
const toast = useToast()

function isDue(d: string): boolean {
  return d <= todayISO()
}

function onReview(id: string) {
  fridge.review(id)
  economy.addXP(5)
  toast.success('🧊 +5 XP')
}
</script>

<style scoped>
.fridge-view { padding: 16px; max-width: 720px; margin: 0 auto; }
.title { font-size: 1.1rem; font-weight: 800; color: var(--text, #E6ECFF); margin-bottom: 14px; }

.empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-dim, #5A6478);
}

.list { display: flex; flex-direction: column; gap: 10px; }

.fridge-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: var(--card-bg, #131A2A);
  border: 1.5px solid var(--border-soft, #1A2236);
}

.fridge-card.due { border-color: #FBBF24; }

.fridge-icon { font-size: 1.6rem; flex-shrink: 0; }
.fridge-info { flex: 1; min-width: 0; }

.fridge-title { font-weight: 700; font-size: 0.95rem; color: var(--text, #E6ECFF); }
.fridge-meta { font-size: 0.75rem; color: var(--text-secondary, #8B95B0); margin-top: 4px; }

.btn-review {
  padding: 8px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7C3AED, #6366F1);
  color: #fff;
  font-weight: 700;
  font-size: 0.82rem;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}
</style>