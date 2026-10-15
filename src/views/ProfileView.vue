<!-- src/views/ProfileView.vue -->
<template>
  <div class="profile-view">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-avatar">
        <NomiAvatar :size="100" />
        <div v-if="user.isPremium" class="hero-crown">👑</div>
      </div>
      <div class="hero-name">{{ user.name || 'Ученик' }}</div>
      <div class="hero-level">
        {{ level.icon }} {{ level.name }} · Уровень {{ levelIdx + 1 }}
      </div>
      <div class="hero-xp-bar">
        <div class="hero-xp-fill" :style="{ width: levelPercent + '%' }" />
      </div>
      <div class="hero-xp-text">{{ levelCur }} / {{ levelNeed }} XP</div>
    </div>

    <!-- Premium -->
    <div v-if="!user.isPremium" class="premium-block" @click="openPremium">
      <div class="premium-crown">💎</div>
      <div class="premium-title">Premium</div>
      <div class="premium-sub">Умный Номи, безлимит, все темы, −30%</div>
      <button class="btn-gold">299 ₽ / мес</button>
    </div>

    <div v-else class="premium-active-block">
      <div class="premium-active-head">
        <div class="premium-active-crown">💎</div>
        <div class="premium-active-info">
          <div class="premium-active-title">Premium активирован</div>
          <div class="premium-active-sub">{{ premiumStatusText }}</div>
        </div>
      </div>
      <div class="premium-active-features">
        <span>✓ Умный Номи</span>
        <span>✓ Все темы</span>
        <span>✓ −30% в магазине</span>
      </div>
    </div>

    <!-- Настройки профиля -->
    <div class="settings-group">
      <div class="setting-row">
        <span class="setting-label">Имя</span>
        <span class="setting-value">{{ user.name || '—' }}</span>
        <button class="icon-btn" @click="editName">
          <AppIcon name="edit" :size="14" />
        </button>
      </div>
      <div class="setting-row">
        <span class="setting-label">Класс</span>
        <select :value="user.grade" @change="onGradeChange" class="inline-select">
          <option v-for="g in 11" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>
      <div class="setting-row">
        <span class="setting-label">
          <AppIcon name="star" :size="14" /> XP
        </span>
        <span class="setting-value">{{ user.xp }}</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">
          <AppIcon name="flame" :size="14" /> Streak
        </span>
        <span class="setting-value">{{ user.streak }}</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">
          <AppIcon name="target" :size="14" /> Стрик ошибок
        </span>
        <span class="setting-value">{{ user.errorStreak }}</span>
      </div>
    </div>

    <!-- Достижения -->
    <div class="achievements-block">
      <div class="ach-title">
        <AppIcon name="star" :size="16" /> Достижения · {{ user.achievements.length }} / 12
      </div>
      <div class="ach-grid">
        <div
          v-for="a in achievementsList"
          :key="a.id"
          class="ach-item"
          :class="{ unlocked: user.achievements.includes(a.id) }"
        >
          <div class="ach-icon">{{ a.icon }}</div>
          <div class="ach-name">{{ a.name }}</div>
        </div>
      </div>
    </div>

    <!-- Мемные достижения -->
    <div class="achievements-block">
      <div class="ach-title">
        <AppIcon name="target" :size="16" /> Мемные · {{ user.memeAchievements.length }} / 42
      </div>
      <div class="meme-progress">
        <div class="meme-fill" :style="{ width: memePercent + '%' }" />
      </div>
      <div class="meme-count">{{ memePercent }}%</div>
    </div>

    <!-- Кнопка настроек -->
    <button class="btn-outline" @click="goSettings">
      <AppIcon name="settings" :size="18" />
      <span>Настройки</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePremiumStore } from '@/stores/premium'
import { useToast } from '@/composables/useToast'
import { getLevel, getLevelIndex } from '@/utils/levels'
import { plural } from '@/utils/date'
import AppIcon from '@/components/ui/AppIcon.vue'
import NomiAvatar from '@/components/nomi/NomiAvatar.vue'

const router = useRouter()
const user = useUserStore()
const premium = usePremiumStore()
const toast = useToast()

const level = computed(() => getLevel(user.xp))
const levelIdx = computed(() => getLevelIndex(user.xp))
const levelPercent = computed(() => {
  const l = level.value
  if (l.max === Infinity) return 100
  return Math.min(100, Math.round(((user.xp - l.min) / (l.max - l.min)) * 100))
})
const levelCur = computed(() => user.xp - level.value.min)
const levelNeed = computed(() =>
  level.value.max === Infinity ? 0 : level.value.max - level.value.min
)

const achievementsList = [
  { id: 'first_hw',      name: 'Первый шаг',       icon: '🌱' },
  { id: 'hw_10',         name: 'Десятка',          icon: '📚' },
  { id: 'hw_50',         name: 'Полтинник',        icon: '🏆' },
  { id: 'streak_7',      name: 'Неделя силы',      icon: '🔥' },
  { id: 'streak_30',     name: 'Месяц огня',       icon: '💎' },
  { id: 'lvl_5',         name: 'Мастер',           icon: '🎓' },
  { id: 'pomo_10',       name: 'Помидорчик',       icon: '🍅' },
  { id: 'topic_5',       name: 'Исследователь',    icon: '🔍' },
  { id: 'premium',       name: 'Premium!',         icon: '💎' },
  { id: 'xp_1000',       name: 'Кладоискатель',    icon: '🎁' },
  { id: 'friend_dragon', name: 'Друг дракона',     icon: '🐉' },
  { id: 'flash_10',      name: 'Карточный мастер', icon: '🎴' }
]

const memePercent = computed(() =>
  Math.round((user.memeAchievements.length / 42) * 100)
)

const premiumStatusText = computed(() => {
  const p = user.premium

  if (p.lifetime) return '🎉 Навсегда'

  if (!p.expiresAt) return '✅ Активен'

  const left = p.expiresAt - Date.now()
  if (left <= 0) return '⏰ Истёк'

  const days = Math.ceil(left / 86400000)
  const date = new Date(p.expiresAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  })

  if (days <= 1) {
    const hours = Math.ceil(left / 3600000)
    return `Осталось ${hours} ч · до ${date}`
  }

  return `Осталось ${days} ${plural(days, ['день', 'дня', 'дней'])} · до ${date}`
})

function openPremium() {
  premium.openModal()
}

function editName() {
  const n = prompt('Новое имя:', user.name)
  if (n && n.trim()) {
    user.name = n.trim()
    toast.success('✅ Имя сохранено')
  }
}

function onGradeChange(e: Event) {
  const v = Number((e.target as HTMLSelectElement).value)
  user.grade = v
  toast.success(`Класс: ${v}`)
}

function goSettings() {
  router.push('/settings')
}
</script>

<style scoped>
.profile-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Hero */
.hero {
  padding: 24px 18px;
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.08));
  border: 1.5px solid rgba(167, 139, 250, 0.4);
  text-align: center;
}

.hero-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 12px;
}

.hero-crown {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.6rem;
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.9));
  animation: crownFloat 3s ease-in-out infinite;
}

@keyframes crownFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(-4px); }
}

.hero-name {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #C4B5FD, #F472B6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-level {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 6px 0 14px;
}

.hero-xp-bar {
  width: 100%;
  max-width: 280px;
  height: 14px;
  background: rgba(10, 14, 26, 0.6);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: 0 auto 6px;
  border: 1px solid rgba(167, 139, 250, 0.3);
}

.hero-xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #8B5CF6, #EC4899);
  transition: width 0.6s;
}

.hero-xp-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 700;
}

/* Premium inactive */
.premium-block {
  padding: 20px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(251, 146, 60, 0.06));
  border: 1.5px solid var(--premium-gold);
  text-align: center;
  cursor: pointer;
}

.premium-crown {
  font-size: 2.5rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.7));
}

.premium-title {
  font-size: 1.3rem;
  font-weight: 800;
  background: var(--grad-gold);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 6px;
}

.premium-sub {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.btn-gold {
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  background: var(--grad-gold);
  color: #0A1930;
  font-weight: 800;
  font-size: 0.92rem;
  border: none;
  cursor: pointer;
}

/* Premium active */
.premium-active-block {
  padding: 18px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(249, 115, 22, 0.08));
  border: 1.5px solid var(--premium-gold);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.15);
}

.premium-active-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.premium-active-crown {
  font-size: 2.4rem;
  filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.8));
  animation: crownPulse 2.5s ease-in-out infinite;
}

@keyframes crownPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}

.premium-active-info { flex: 1; }

.premium-active-title {
  font-size: 1rem;
  font-weight: 800;
  background: var(--grad-gold);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 4px;
}

.premium-active-sub {
  font-size: 0.78rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.premium-active-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.premium-active-features span {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(251, 191, 36, 0.12);
  color: var(--premium-gold);
  font-size: 0.7rem;
  font-weight: 700;
}

/* Settings */
.settings-group {
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px solid var(--border-soft);
  overflow: hidden;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-soft);
  gap: 12px;
}

.setting-row:last-child { border-bottom: none; }

.setting-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  font-weight: 500;
  flex: 1;
  color: var(--text);
}

.setting-value {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inline-select {
  padding: 6px 30px 6px 10px;
  border-radius: 10px;
  background: var(--card-bg-2);
  color: var(--text);
  border: 1.5px solid var(--border);
  font-size: 0.85rem;
}

/* Achievements */
.achievements-block {
  padding: 16px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
}

.ach-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
}

.ach-title :deep(svg) { color: #A78BFA; }

.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 8px;
}

.ach-item {
  padding: 10px 4px;
  border-radius: var(--radius-sm);
  background: var(--card-bg-2);
  border: 1.5px solid var(--border);
  text-align: center;
  opacity: 0.35;
  overflow: hidden;
}

.ach-item.unlocked {
  opacity: 1;
  border-color: var(--success);
  background: rgba(34, 197, 94, 0.06);
}

.ach-icon { font-size: 1.5rem; margin-bottom: 4px; }

.ach-name {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meme-progress {
  width: 100%;
  height: 10px;
  background: var(--border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.meme-fill {
  height: 100%;
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  transition: width 0.6s;
}

.meme-count {
  text-align: right;
  font-size: 0.75rem;
  font-weight: 700;
  color: #A78BFA;
  margin-top: 6px;
}

.btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: var(--radius);
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text);
  font-weight: 700;
  cursor: pointer;
}
</style>