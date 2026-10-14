<!-- src/views/QuestsView.vue -->
<template>
  <div class="quests-view">
    <div class="title">🗺 Квесты</div>

    <!-- Квесты -->
    <div class="list">
      <div
        v-for="q in quests"
        :key="q.id"
        class="quest-card"
        :class="{ completed: isDone(q) }"
      >
        <div class="quest-head">
          <span class="quest-icon">{{ q.icon }}</span>
          <div class="quest-info">
            <div class="quest-name">{{ q.name }}</div>
            <div class="quest-desc">{{ q.desc }}</div>
          </div>
          <span v-if="isDone(q)" class="quest-check">✅</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: pct(q) + '%' }" />
        </div>
        <div class="quest-label">
          <span>{{ Math.min(q.get(stats), q.max) }} / {{ q.max }}</span>
          <span>+{{ q.xp }} XP</span>
        </div>
      </div>
    </div>

    <!-- Боссы -->
    <div class="section-title">💀 Боссы</div>
    <div class="bosses">
      <div v-for="b in bosses" :key="b.id" class="boss-card">
        <div class="boss-avatar">{{ b.icon }}</div>
        <div class="boss-name">{{ b.name }}</div>
        <div class="boss-desc">{{ b.desc }}</div>
        <div class="boss-hp-bar">
          <div class="boss-hp-fill" :style="{ width: bossHp(b) + '%' }" />
        </div>
        <div class="boss-hp-label">HP: {{ bossHp(b) }}%</div>
      </div>
    </div>

    <!-- Дерево навыков -->
    <div class="section-title">🌳 Дерево навыков</div>
    <div v-if="!user.isPremium" class="premium-lock">
      <div class="lock-icon">💎</div>
      <p>В Premium</p>
      <button class="btn-gold" @click="openPremium">Открыть</button>
    </div>
    <div v-else class="skill-tree">
      <div
        v-for="s in skills"
        :key="s.id"
        class="skill-node"
        :class="{ done: isSkillDone(s) }"
      >
        <div class="skill-icon">{{ s.icon }}</div>
        <div class="skill-info">
          <div class="skill-name">
            {{ s.name }} <span v-if="isSkillDone(s)">✅</span>
          </div>
          <div class="skill-desc">{{ s.desc }}</div>
          <div class="progress-bar" style="height: 6px; margin-top: 6px;">
            <div class="progress-fill" :style="{ width: pct(s) + '%' }" />
          </div>
          <div class="skill-reward">{{ s.reward }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useHomeworkStore } from '@/stores/homework'
import { usePremiumStore } from '@/stores/premium'
import { QUESTS, BOSSES, SKILLS, type QuestStats } from '@/data/quests'

const user = useUserStore()
const hw = useHomeworkStore()
const premium = usePremiumStore()

const stats = computed<QuestStats>(() => ({
  hwDone: hw.done.length,
  pomodoro: user.pomodoroCount,
  viewedTopics: user.viewedTopics.length,
  solvedProblems: user.solvedProblems.length,
  streak: user.streak,
  flashCompleted: user.completedFlashCards.length
}))

const quests = computed(() => user.isPremium ? QUESTS : QUESTS.slice(0, 5))
const bosses = computed(() => user.isPremium ? BOSSES : BOSSES.slice(0, 3))
const skills = SKILLS

function pct(q: { get: (s: QuestStats) => number; max: number }): number {
  return Math.min(100, Math.round((q.get(stats.value) / q.max) * 100))
}

function isDone(q: { get: (s: QuestStats) => number; max: number }): boolean {
  return q.get(stats.value) >= q.max
}

function bossHp(b: { get: (s: QuestStats) => number; max: number }): number {
  return Math.max(0, 100 - Math.round((b.get(stats.value) / b.max) * 100))
}

function isSkillDone(s: { get: (s: QuestStats) => number; max: number }): boolean {
  return s.get(stats.value) >= s.max
}

function openPremium() {
  premium.openModal()
}
</script>

<style scoped>
.quests-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.title { font-size: 1.1rem; font-weight: 800; color: var(--text, #E6ECFF); margin-bottom: 14px; }

.section-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text, #E6ECFF);
  margin: 20px 0 12px;
}

.list { display: flex; flex-direction: column; gap: 10px; }

.quest-card {
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--card-bg, #131A2A);
  border: 1px solid var(--border-soft, #1A2236);
  border-left: 4px solid #7C3AED;
}

.quest-card.completed { border-left-color: #22C55E; }

.quest-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}

.quest-icon { font-size: 1.6rem; }

.quest-info { flex: 1; }

.quest-name { font-weight: 800; font-size: 0.95rem; color: var(--text, #E6ECFF); }
.quest-desc { font-size: 0.8rem; color: var(--text-secondary, #8B95B0); margin-top: 2px; }

.quest-check { font-size: 1.4rem; }

.progress-bar {
  width: 100%;
  height: 10px;
  background: var(--border, #1E2740);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #7C3AED, #6366F1);
  transition: width 0.6s;
}

.quest-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--text-secondary, #8B95B0);
  font-weight: 700;
  margin-top: 6px;
}

.bosses {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.boss-card {
  padding: 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(139, 92, 246, 0.1));
  border: 2px solid #EF4444;
  text-align: center;
}

.boss-avatar { font-size: 4rem; margin-bottom: 10px; }
.boss-name { font-size: 1.3rem; font-weight: 800; color: #EF4444; margin-bottom: 6px; }
.boss-desc { font-size: 0.85rem; color: var(--text-secondary, #8B95B0); margin-bottom: 14px; }

.boss-hp-bar {
  width: 100%;
  max-width: 400px;
  height: 20px;
  background: var(--border, #1E2740);
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto 10px;
}

.boss-hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #DC2626, #F87171);
  transition: width 0.6s;
}

.boss-hp-label {
  font-size: 0.75rem;
  color: var(--text-secondary, #8B95B0);
  font-weight: 700;
}

.skill-tree { display: flex; flex-direction: column; gap: 10px; }

.skill-node {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: var(--card-bg, #131A2A);
  border: 1.5px solid var(--border-soft, #1A2236);
  align-items: center;
}

.skill-node.done { border-color: #22C55E; }

.skill-icon { font-size: 2rem; flex-shrink: 0; }
.skill-info { flex: 1; min-width: 0; }

.skill-name { font-weight: 800; font-size: 0.92rem; color: var(--text, #E6ECFF); }
.skill-desc { font-size: 0.78rem; color: var(--text-secondary, #8B95B0); margin-top: 2px; }
.skill-reward { font-size: 0.72rem; color: #FBBF24; font-weight: 800; margin-top: 4px; }

.premium-lock {
  padding: 24px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(251, 146, 60, 0.05));
  border: 1.5px dashed #FBBF24;
  text-align: center;
}

.lock-icon { font-size: 2.5rem; margin-bottom: 8px; }
.premium-lock p { font-size: 0.9rem; color: var(--text-secondary, #8B95B0); margin-bottom: 12px; font-weight: 600; }

.btn-gold {
  padding: 10px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  color: #0A0E1A;
  font-weight: 800;
  border: none;
  cursor: pointer;
}
</style>