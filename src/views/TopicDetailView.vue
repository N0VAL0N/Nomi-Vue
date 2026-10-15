<!-- src/views/TopicDetailView.vue -->
<template>
  <div v-if="topic" class="topic-detail">
    <button class="back-btn" @click="router.back()">
      <AppIcon name="back" :size="18" /> Назад
    </button>

    <!-- Заголовок -->
    <div class="header">
      <div class="header-icon">{{ topic.icon }}</div>
      <div class="header-title">{{ topic.title }}</div>
      <div class="header-subject">{{ topic.subject }} · {{ topic.class }} класс</div>
    </div>

    <!-- Вкладки -->
    <div class="tabs">
      <button
        class="tab"
        :class="{ active: tab === 'theory' }"
        @click="tab = 'theory'"
      >
        📖 Теория
      </button>
      <button
        v-if="topic.problems.length"
        class="tab"
        :class="{ active: tab === 'problems' }"
        @click="tab = 'problems'"
      >
        ✏️ Задачи ({{ topic.problems.length }})
      </button>
      <button
        v-if="topic.problems.length >= 3"
        class="tab"
        :class="{ active: tab === 'test' }"
        @click="startTest"
      >
        🧪 Тест
      </button>
    </div>

    <!-- Теория -->
    <div v-if="tab === 'theory'" class="theory" v-html="theoryHtml" />

    <!-- Задачи -->
    <div v-if="tab === 'problems'" class="problems">
      <div
        v-for="(p, i) in topic.problems"
        :key="i"
        class="problem"
        :class="{ solved: isSolved(i) }"
      >
        <div class="problem-num">Задача {{ i + 1 }}</div>
        <div class="problem-q">{{ p.q }}</div>

        <div class="problem-input-row">
          <input
            v-model="answers[i]"
            type="text"
            placeholder="Ответ..."
            @keydown.enter="checkAnswer(i)"
          />
          <button @click="checkAnswer(i)">Проверить</button>
        </div>

        <div
          v-if="feedback[i]"
          class="feedback"
          :class="feedback[i].ok ? 'correct' : 'wrong'"
        >
          {{ feedback[i].msg }}
        </div>

        <div class="problem-actions">
          <button v-if="p.hint" @click="toggleHint(i)">💡 Подсказка</button>
          <button @click="toggleSolution(i)">📖 Решение</button>
        </div>

        <div v-if="showHint[i]" class="hint">💡 {{ p.hint }}</div>
        <div v-if="showSolution[i]" class="solution">✅ {{ p.solution }}</div>
      </div>
    </div>

    <!-- Тест -->
    <div v-if="tab === 'test'" class="test-panel">
      <div class="test-head">
        🧪 Тест: {{ testQuestions.length }} вопросов
      </div>

      <div
        v-for="(p, i) in testQuestions"
        :key="i"
        class="test-question"
      >
        <div class="test-num">Вопрос {{ i + 1 }}</div>
        <div class="test-text">{{ p.q }}</div>
        <input
          v-model="testAnswers[i]"
          type="text"
          placeholder="Ответ..."
          :disabled="testDone"
        />
        <div v-if="testDone" class="test-result" :class="isCorrect(i) ? 'ok' : 'wrong'">
          {{ isCorrect(i) ? '✅ Верно' : '❌ ' + p.solution }}
        </div>
      </div>

      <button
        v-if="!testDone"
        class="btn"
        @click="checkTest"
      >
        Завершить тест
      </button>

      <div v-else class="test-summary" :class="testPassed ? 'ok' : 'fail'">
        <div class="test-score">{{ testScore }} / {{ testQuestions.length }}</div>
        <div class="test-msg">
          {{ testPassed ? '🎉 Отлично! Тема освоена' : '😢 Меньше 60%. Тема вернулась в холодильник' }}
        </div>
        <button class="btn" @click="startTest">Пройти ещё раз</button>
      </div>
    </div>
  </div>

  <div v-else class="empty">Тема не найдена</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAllTopics } from '@/data/topics'
import { renderTheoryHTML } from '@/utils/render'
import { normalizeAns } from '@/utils/string'
import { useUserStore } from '@/stores/user'
import { useFridgeStore } from '@/stores/fridge'
import { useEconomy } from '@/composables/useEconomy'
import { useToast } from '@/composables/useToast'
import { useSound } from '@/composables/useSound'
import AppIcon from '@/components/ui/AppIcon.vue'
import type { Problem } from '@/types/topic'
import { todayISO } from '@/utils/date'
import { usePlanStore } from '@/stores/plan'

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const fridge = useFridgeStore()
const economy = useEconomy()
const toast = useToast()
const sound = useSound()
const plan = usePlanStore()

const tab = ref<'theory' | 'problems' | 'test'>('theory')
const answers = ref<Record<number, string>>({})
const feedback = ref<Record<number, { ok: boolean; msg: string }>>({})
const showHint = ref<Record<number, boolean>>({})
const showSolution = ref<Record<number, boolean>>({})

// Тест
const testQuestions = ref<Problem[]>([])
const testAnswers = ref<Record<number, string>>({})
const testDone = ref(false)
const testScore = ref(0)

const topic = computed(() =>
  getAllTopics().find((t) => t.id === route.params.id)
)

const theoryHtml = computed(() =>
  topic.value ? renderTheoryHTML(topic.value.theory) : ''
)

const testPassed = computed(() =>
  testQuestions.value.length > 0 && testScore.value / testQuestions.value.length >= 0.6
)

function problemKey(i: number): string {
  return `${topic.value?.id}#${i}`
}

function isSolved(i: number): boolean {
  return user.solvedProblems.includes(problemKey(i))
}

function checkAnswer(i: number) {
  const t = topic.value
  if (!t) return
  const p = t.problems[i]
  const key = problemKey(i)
  const userAns = normalizeAns(answers.value[i] || '')
  const correct = normalizeAns(p.solution)

  if (!userAns) {
    feedback.value[i] = { ok: false, msg: '✏️ Напиши ответ' }
    return
  }

  const ok = userAns === correct || (correct.includes(userAns) && userAns.length >= 3)

  if (ok) {
    feedback.value[i] = { ok: true, msg: `✅ Верно! +10 XP` }
    if (!user.solvedProblems.includes(key)) {
      user.solvedProblems.push(key)
      economy.addXP(10)
    }
    user.errorStreak++

    // Если задача была в дневнике — помечаем решённой
    if (user.errorDiary[key]) {
      user.errorDiary[key].solved = true
      user.errorDiary[key].lastTry = todayISO()
    }

    sound.success()
    economy.logActivity()
    window.navigator.vibrate?.(20)
  } else {
    feedback.value[i] = { ok: false, msg: '❌ Не совсем. Попробуй ещё.' }
    user.errorStreak = 0

    // Записываем в дневник ошибок
    if (!user.errorDiary[key]) {
      user.errorDiary[key] = {
        topicId: t.id,
        topicTitle: t.title,
        question: p.q,
        wrongCount: 0,
        lastTry: todayISO(),
        solved: false
      }
    }
    user.errorDiary[key].wrongCount++
    user.errorDiary[key].lastTry = todayISO()
  }
}

function toggleHint(i: number) {
  showHint.value[i] = !showHint.value[i]
}

function toggleSolution(i: number) {
  showSolution.value[i] = !showSolution.value[i]
}

// ============ ТЕСТ ============
function startTest() {
  const t = topic.value
  if (!t || t.problems.length < 3) {
    toast.info('Нужно минимум 3 задачи')
    return
  }
  const shuffled = [...t.problems].sort(() => Math.random() - 0.5).slice(0, 5)
  testQuestions.value = shuffled
  testAnswers.value = {}
  testDone.value = false
  testScore.value = 0
  tab.value = 'test'
}

function isCorrect(i: number): boolean {
  const q = testQuestions.value[i]
  if (!q) return false
  const ua = normalizeAns(testAnswers.value[i] || '')
  const ca = normalizeAns(q.solution)
  if (!ua) return false
  return ua === ca || (ca.includes(ua) && ua.length >= 3)
}

function checkTest() {
  const t = topic.value
  const today = todayISO()
  if (!t) return

  let score = 0
  testQuestions.value.forEach((_, i) => {
    if (isCorrect(i)) score++
  })
  testScore.value = score
  testDone.value = true

  if (score / testQuestions.value.length >= 0.6) {
    economy.addXP(30)
    sound.success()
    toast.success(`🎉 ${score}/${testQuestions.value.length} · +30 XP`)
  } else {
    fridge.add(t.id, t.title)
    toast.warning(`😢 ${score}/${testQuestions.value.length} · тема в холодильник`)
  }

  const planDay = plan.days.find((d) => d.date === today)
  if (planDay && planDay.topicId === t.id && !planDay.done) {
    plan.markDone(today, score)
    toast.success('📋 День плана выполнен!')
  }
}

watch(
  () => route.params.id,
  () => {
    answers.value = {}
    feedback.value = {}
    showHint.value = {}
    showSolution.value = {}
    testQuestions.value = []
    testAnswers.value = {}
    testDone.value = false
    testScore.value = 0
    tab.value = 'theory'
  }
)
</script>

<style scoped>
.topic-detail {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.85rem;
  padding: 8px 0;
  margin-bottom: 8px;
  cursor: pointer;
  border: none;
}

.header {
  padding: 20px;
  border-radius: var(--radius-lg);
  background: var(--grad-purple);
  color: #fff;
  margin-bottom: 16px;
}

.header-icon { font-size: 2.4rem; margin-bottom: 6px; }
.header-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; }
.header-subject {
  font-size: 0.78rem;
  opacity: 0.9;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }

.tab {
  flex: 1;
  min-width: fit-content;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--card-bg-2);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
}

.tab.active {
  background: var(--grad-purple);
  color: #fff;
  border-color: transparent;
}

.theory {
  padding: 18px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.theory :deep(h3) {
  font-size: 1.05rem;
  color: var(--text);
  margin: 20px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-soft);
}
.theory :deep(h3:first-child) { margin-top: 0; }
.theory :deep(ul), .theory :deep(ol) { margin: 8px 0 14px 22px; }
.theory :deep(li) { margin-bottom: 5px; }
.theory :deep(code) {
  background: var(--card-bg-2);
  padding: 2px 6px;
  border-radius: 5px;
  font-family: monospace;
  color: #64B5F6;
}
.theory :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 0.84rem;
  background: var(--card-bg-2);
  border-radius: 8px;
  overflow: hidden;
}
.theory :deep(table th) {
  background: var(--card-bg);
  color: var(--text);
  font-weight: 800;
  text-align: left;
  padding: 9px 11px;
  border-bottom: 1.5px solid var(--border);
}
.theory :deep(table td) {
  padding: 8px 11px;
  border-bottom: 1px solid var(--border-soft);
}
.theory :deep(.callout) {
  background: rgba(139, 92, 246, 0.12);
  border-left: 3px solid #7C3AED;
  padding: 12px 14px;
  border-radius: 8px;
  margin: 12px 0;
  color: var(--text);
}

/* Problems */
.problems { display: flex; flex-direction: column; gap: 12px; }

.problem {
  padding: 16px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1.5px solid var(--border-soft);
}
.problem.solved {
  border-color: var(--success);
  background: rgba(34, 197, 94, 0.06);
}

.problem-num {
  display: inline-block;
  background: var(--grad-purple);
  color: #fff;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.problem-q {
  font-size: 0.95rem;
  line-height: 1.55;
  margin-bottom: 12px;
  color: var(--text);
  font-weight: 500;
}

.problem-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.problem-input-row input {
  flex: 1;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: var(--card-bg-2);
  color: var(--text);
  border: 1.5px solid var(--border);
  font-size: 0.9rem;
  outline: none;
}

.problem-input-row button {
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  background: var(--grad-purple);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.feedback {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.feedback.correct { background: rgba(34, 197, 94, 0.15); color: var(--success); }
.feedback.wrong   { background: rgba(239, 68, 68, 0.12); color: var(--danger); }

.problem-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.problem-actions button {
  padding: 7px 13px;
  border-radius: 9px;
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--card-bg-2);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  cursor: pointer;
}

.hint {
  margin-top: 10px;
  padding: 11px 13px;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.55;
  background: rgba(251, 191, 36, 0.1);
  border-left: 3px solid var(--warning);
  color: var(--text);
}

.solution {
  margin-top: 10px;
  padding: 11px 13px;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.55;
  background: rgba(139, 92, 246, 0.1);
  border-left: 3px solid var(--purple);
  color: var(--text);
}

/* TEST */
.test-panel { display: flex; flex-direction: column; gap: 16px; }

.test-head {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text);
  padding: 12px 0;
}

.test-question {
  padding: 16px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1.5px solid var(--border-soft);
}

.test-num {
  font-size: 0.72rem;
  font-weight: 800;
  color: #A78BFA;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.test-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
}

.test-question input {
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--card-bg-2);
  border: 1.5px solid var(--border);
  color: var(--text);
  font-size: 0.95rem;
  outline: none;
}

.test-result {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 700;
}
.test-result.ok    { background: rgba(34, 197, 94, 0.15); color: var(--success); }
.test-result.wrong { background: rgba(239, 68, 68, 0.12); color: var(--danger); }

.test-summary {
  padding: 20px;
  border-radius: var(--radius);
  text-align: center;
}
.test-summary.ok   { background: rgba(34, 197, 94, 0.1); border: 1.5px solid var(--success); }
.test-summary.fail { background: rgba(239, 68, 68, 0.1); border: 1.5px solid var(--danger); }

.test-score {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1;
  margin-bottom: 8px;
}

.test-msg {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.btn {
  width: 100%;
  padding: 14px;
  border-radius: var(--radius-sm);
  background: var(--grad-purple);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}
</style>