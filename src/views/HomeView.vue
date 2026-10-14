<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <!-- Комната с кубом + HUD -->
    <NomiRoom :compact="true" :show-hud="true" :show-tip="true" :avatar-size="100" />

    <!-- Сундук -->
    <div
      v-if="user.isPremium"
      class="chest glass"
      :class="{ opened: chest.isOpenToday }"
      @click="openChest"
    >
      <AppIcon :name="chest.isOpenToday ? 'check' : 'gift'" :size="28" />
      <div class="chest-info">
        <div class="chest-title">{{ chest.isOpenToday ? 'Сундук открыт' : 'Ежедневный сундук' }}</div>
        <div class="chest-sub">{{ chest.isOpenToday ? 'Заходи завтра!' : 'Открой!' }}</div>
      </div>
      <AppIcon v-if="!chest.isOpenToday" name="sparkles" :size="20" />
    </div>

    <!-- Прогресс -->
    <div class="progress-card" @click="goSettings">
      <div class="progress-head">
        <span>📚 УЧЁБА</span>
        <span class="progress-pct">{{ progress.studyPercent }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress.studyPercent + '%' }" />
      </div>
    </div>

    <div class="progress-card" @click="goSettings">
      <div class="progress-head">
        <span>🏖️ КАНИКУЛЫ</span>
        <span class="progress-pct">{{ progress.daysToVacation >= 0 ? progress.daysToVacation + 'д' : '—' }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill gold" :style="{ width: vacationPercent + '%' }" />
      </div>
      <div class="progress-label">{{ progress.vacationLabel }}</div>
    </div>

    <!-- Быстрые действия -->
    <div class="section-title">⚡ Быстрые действия</div>
    <div class="quick-grid">
      <button v-for="a in quickActions" :key="a.to" v-ripple class="quick-card" @click="router.push(a.to)">
        <AppIcon :name="a.icon" :size="22" />
        <div class="quick-label">{{ a.label }}</div>
        <div class="quick-sub">{{ a.sub }}</div>
      </button>
    </div>

    <!-- Цитата -->
    <div class="quote-card" @click="refreshQuote">
      <div class="quote-label">💭 Цитата дня</div>
      <div class="quote-text">«{{ quote.text }}»</div>
      <div class="quote-author">— {{ quote.author }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useHomeworkStore } from '@/stores/homework'
import { useChecklistStore } from '@/stores/checklist'
import { useProgressStore } from '@/stores/progress'
import { useChestStore } from '@/stores/chest'
import { useEconomy } from '@/composables/useEconomy'
import { useToast } from '@/composables/useToast'
import { useSound } from '@/composables/useSound'
import { useConfetti } from '@/composables/useConfetti'
import { randomQuote, type Quote } from '@/data/quotes'
import { vRipple } from '@/directives/ripple'
import AppIcon from '@/components/ui/AppIcon.vue'
import NomiRoom from '@/components/nomi/NomiRoom.vue'

const router = useRouter()
const user = useUserStore()
const hw = useHomeworkStore()
const cl = useChecklistStore()
const progress = useProgressStore()
const chest = useChestStore()
const economy = useEconomy()
const toast = useToast()
const sound = useSound()
const { confetti } = useConfetti()

const quote = ref<Quote>(randomQuote())

const vacationPercent = computed(() => {
  if (progress.onVacation) return 100
  if (progress.daysToVacation < 0) return 0
  return Math.max(0, Math.min(100, Math.round((1 - progress.daysToVacation / 90) * 100)))
})

const quickActions = computed(() => [
  { icon: 'book',     label: 'Темы',       sub: 'Изучать',   to: '/topics' },
  { icon: 'list',     label: 'ДЗ',          sub: `${hw.pending.length}`,  to: '/hw' },
  { icon: 'calendar', label: 'Расписание', sub: 'На день',   to: '/schedule' },
  { icon: 'clock',    label: 'Таймер',      sub: '25/5',      to: '/timer' },
  { icon: 'check',    label: 'Задачи',      sub: `${cl.pending.length}`,  to: '/checklist' },
  { icon: 'chart',    label: 'Статистика', sub: 'Прогресс',  to: '/stats' }
])

function refreshQuote() {
  quote.value = randomQuote()
}

function openChest() {
  const reward = chest.open()
  if (reward === 0) { toast.info('📭 Уже открыт'); return }
  economy.addXP(reward)
  confetti(50, true, true)
  sound.fanfare()
  toast.gold(`🎁 +${reward} XP!`)
}

function goSettings() {
  router.push('/settings')
}
</script>

<style scoped>
.home {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ---------- Chest ---------- */
.chest {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius);
  cursor: pointer;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(249, 115, 22, 0.1)) !important;
  border: 2px solid var(--premium-gold) !important;
}
.chest.opened { opacity: 0.6; }
.chest :deep(svg) { color: var(--premium-gold); }
.chest-info { flex: 1; }
.chest-title {
  font-weight: 800;
  font-size: 0.92rem;
  color: var(--premium-gold);
}
.chest-sub {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* ---------- Progress ---------- */
.progress-card {
  padding: 14px 16px;
  border-radius: var(--radius);
  background: var(--grad-card);
  border: 1px solid var(--border-soft);
  cursor: pointer;
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
.progress-fill.gold { background: var(--grad-gold); }
.progress-label {
  text-align: right;
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-top: 6px;
  font-weight: 600;
}

/* ---------- Quick actions ---------- */
.section-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--text);
  margin-top: 6px;
}
.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.quick-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--grad-card);
  border: 1px solid var(--border-soft);
  color: var(--text);
  text-align: left;
  overflow: hidden;
}
.quick-card :deep(svg) { color: #A78BFA; }
.quick-label {
  font-weight: 700;
  font-size: 0.82rem;
}
.quick-sub {
  font-size: 0.65rem;
  color: var(--text-secondary);
  font-weight: 600;
}

/* ---------- Quote ---------- */
.quote-card {
  padding: 16px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(99, 102, 241, 0.08));
  border: 1px solid rgba(124, 58, 237, 0.3);
  cursor: pointer;
}
.quote-label {
  font-size: 0.72rem;
  font-weight: 800;
  color: #A78BFA;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}
.quote-text {
  font-size: 0.92rem;
  font-style: italic;
  line-height: 1.5;
  color: var(--text);
}
.quote-author {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 8px;
  font-weight: 600;
}
</style>