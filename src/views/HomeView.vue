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
        <span><AppIcon name="book" :size="14" /> УЧЁБА</span>
        <span class="progress-pct">{{ progress.studyPercent }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress.studyPercent + '%' }" />
      </div>
    </div>

    <!-- Загруженность дня -->
    <div class="progress-card" @click="router.push('/schedule')">
      <div class="progress-head">
        <span><AppIcon name="zap" :size="14" /> ЗАГРУЗКА ДНЯ</span>
        <span class="progress-pct">{{ loadPercent }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: loadPercent + '%', background: loadColor }" />
      </div>
      <div class="progress-label">
        {{ loadHours }} ч {{ loadMins }} мин ·
        {{ todayLessons.length }} уроков ·
        {{ todayActivities.length }} кружков
      </div>
    </div>

    <div
      class="progress-card plan-card"
      :class="{ ready: plan.days.length === 0 || plan.isStale }"
      @click="router.push('/plan')"
    >
      <div class="progress-head">
        <span><AppIcon name="list" :size="14" /> ПЛАН НА 7 ДНЕЙ</span>
        <span class="progress-pct">{{ plan.days.length === 0 ? '—' : plan.progress + '%' }}</span>
      </div>
      <div v-if="plan.days.length > 0" class="progress-bar">
        <div class="progress-fill gold" :style="{ width: plan.progress + '%' }" />
      </div>
      <div class="progress-label">
        {{ plan.days.length === 0 ? 'Нажми, чтобы создать план' : `${plan.days.filter(d => d.done).length} из ${plan.days.length} готово` }}
      </div>
    </div>

    <div class="progress-card" @click="goSettings">
      <div class="progress-head">
        <span><AppIcon name="sun" :size="14" /> КАНИКУЛЫ</span>
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
      <div class="quote-label">
        <AppIcon name="sparkles" :size="14" /> Цитата дня
      </div>
      <div class="quote-text">«{{ quote.text }}»</div>
      <div class="quote-author">— {{ quote.author }}</div>
    </div>

    <!-- Советы Номи -->
    <div v-if="smart.suggestions.length > 0" class="smart-block">
      <div class="smart-header">
        <NomiAvatar :size="32" />
        <span>Номи советует</span>
      </div>
      <div
        v-for="s in smart.suggestions.slice(0, 3)"
        :key="s.id"
        class="smart-card"
        @click="goTo(s.actionRoute)"
      >
        <div class="smart-icon">{{ s.icon }}</div>
        <div class="smart-body">
          <div class="smart-title">{{ s.title }}</div>
          <div class="smart-text">{{ s.body }}</div>
        </div>
        <AppIcon name="back" :size="16" class="smart-arrow" />
      </div>
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
import { useLoadStats } from '@/composables/useLoadStats'
import { usePlanStore } from '@/stores/plan'
import { useSmartNotificationsStore } from '@/stores/smartNotifications'
import NomiAvatar from '@/components/nomi/NomiAvatar.vue'

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
const smart = useSmartNotificationsStore()
const plan = usePlanStore()
const {
  lessons: todayLessons,
  activities: todayActivities,
  loadPercent,
  loadHours,
  loadMins
} = useLoadStats()

const quote = ref<Quote>(randomQuote())

const vacationPercent = computed(() => {
  if (progress.onVacation) return 100
  if (progress.daysToVacation < 0) return 0
  return Math.max(0, Math.min(100, Math.round((1 - progress.daysToVacation / 90) * 100)))
})

const loadColor = computed(() => {
  if (loadPercent.value >= 80) return 'linear-gradient(135deg, #EF4444, #DC2626)'
  if (loadPercent.value >= 50) return 'linear-gradient(135deg, #FBBF24, #F59E0B)'
  return 'linear-gradient(135deg, #22C55E, #4ADE80)'
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

function goTo(route?: string) {
  if (route) router.push(route)
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

.smart-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(99, 102, 241, 0.06));
  border: 1px solid rgba(124, 58, 237, 0.3);
}

.smart-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #A78BFA;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 4px;
}

.smart-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  cursor: pointer;
  transition: transform 0.15s;
}

.smart-card:active { transform: scale(0.98); }

.smart-icon {
  font-size: 1.4rem;
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.smart-body { flex: 1; min-width: 0; }

.smart-title {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text);
}

.smart-text {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.smart-arrow {
  transform: rotate(180deg);
  color: var(--text-dim);
  flex-shrink: 0;
}
</style>