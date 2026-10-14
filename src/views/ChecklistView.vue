<!-- src/views/ChecklistView.vue -->
<template>
  <div class="checklist-view">
    <div class="title">✅ Чек-лист</div>

    <!-- Инпут + добавить -->
    <div class="input-row">
      <input
        v-model="newText"
        type="text"
        placeholder="Новая задача..."
        maxlength="100"
        @keydown.enter="add"
      />
      <button v-ripple @click="add">+</button>
    </div>

    <!-- Дата / время / повтор -->
    <div class="form-row-3">
      <input v-model="newDate" type="date" />
      <input v-model="newTime" type="time" />
      <select v-model="newRepeat">
        <option value="none">Без повтора</option>
        <option value="day">Каждый день</option>
        <option value="week">Каждую неделю</option>
      </select>
    </div>

    <!-- Моё задание -->
    <label class="custom-check">
      <input type="checkbox" v-model="newCustom" />
      <span>📌 Моё задание (пойдёт в загруженность дня)</span>
    </label>

    <!-- Фильтры -->
    <div class="chips-row">
      <button
        v-for="f in filters"
        :key="f.value"
        class="chip"
        :class="{ active: cl.filter === f.value }"
        @click="cl.filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Список -->
    <div v-if="filtered.length === 0" class="empty">📋 Задач пока нет</div>
    <div v-else class="task-list">
      <div
        v-for="t in filtered"
        :key="t.id"
        class="task-card"
        :class="{ done: t.done }"
      >
        <button
          class="task-checkbox"
          :class="{ checked: t.done }"
          @click="onToggle(t.id)"
        >
          {{ t.done ? '✓' : '' }}
        </button>
        <div class="task-body">
          <div class="task-text">{{ t.text }}</div>
          <div class="task-meta">
            <span>📅 {{ formatDate(t.date) }}</span>
            <span v-if="t.time" class="badge-time">🕐 {{ t.time }}</span>
            <span v-if="t.repeat !== 'none'" class="badge-repeat">
              🔁 {{ repeatLabel(t.repeat) }}
            </span>
            <span v-if="t.custom" class="badge-custom">📌 моё</span>
          </div>
        </div>
        <button class="task-del" @click="onDelete(t.id)">🗑</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChecklistStore, type RepeatType } from '@/stores/checklist'
import { useEconomy } from '@/composables/useEconomy'
import { useToast } from '@/composables/useToast'
import { useSound } from '@/composables/useSound'
import { todayISO, addDays, formatDate } from '@/utils/date'
import { shortId } from '@/utils/id'
import { vRipple } from '@/directives/ripple'

const cl = useChecklistStore()
const economy = useEconomy()
const toast = useToast()
const sound = useSound()

const newText = ref('')
const newDate = ref(todayISO())
const newTime = ref('')
const newRepeat = ref<RepeatType>('none')
const newCustom = ref(false)

const filters = [
  { value: 'active', label: 'Активные' },
  { value: 'today', label: 'Сегодня' },
  { value: 'tomorrow', label: 'Завтра' },
  { value: 'overdue', label: 'Просрочено' },
  { value: 'done', label: 'Выполнено' },
  { value: 'all', label: 'Все' }
] as const

const filtered = computed(() => {
  const today = todayISO()
  const tmr = addDays(today, 1)
  let list = [...cl.items]

  switch (cl.filter) {
    case 'active':   list = list.filter((t) => !t.done); break
    case 'today':    list = list.filter((t) => t.date === today); break
    case 'tomorrow': list = list.filter((t) => t.date === tmr); break
    case 'overdue':  list = list.filter((t) => !t.done && t.date && t.date < today); break
    case 'done':     list = list.filter((t) => t.done); break
  }

  list.sort((a, b) => Number(a.done) - Number(b.done) || (a.date || '').localeCompare(b.date || ''))
  return list
})

function repeatLabel(r: RepeatType): string {
  const labels: Record<RepeatType, string> = {
    none: '',
    '5min': 'каждые 5 мин',
    '1h': 'каждый час',
    '24h': 'каждые 24ч',
    day: 'каждый день',
    week: 'каждую неделю'
  }
  return labels[r]
}

function add() {
  const text = newText.value.trim()
  if (!text) {
    toast.error('Введите задачу')
    return
  }
  cl.add({
    id: shortId(),
    text,
    date: newDate.value || todayISO(),
    time: newTime.value,
    repeat: newRepeat.value,
    done: false,
    createdAt: Date.now(),
    custom: newCustom.value
  })
  newText.value = ''
  newTime.value = ''
  newRepeat.value = 'none'
  newCustom.value = false
  sound.success()
  toast.success('✅ Добавлено')
}

function onToggle(id: string) {
  cl.toggle(id)
  const t = cl.items.find((x) => x.id === id)
  if (t?.done) {
    economy.addXP(5)
    economy.logActivity()
    sound.success()
    toast.success('✅ +5 XP')
  }
}

function onDelete(id: string) {
  cl.remove(id)
  toast.info('🗑 Удалено')
}
</script>

<style scoped>
.checklist-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 14px;
}

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.input-row input {
  flex: 1;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--card-bg-2);
  color: var(--text);
  border: 1.5px solid var(--border);
  font-size: 0.95rem;
  outline: none;
}

.input-row button {
  padding: 12px 18px;
  border-radius: var(--radius-sm);
  background: var(--grad-purple);
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
}

.form-row-3 {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.form-row-3 > * {
  flex: 1;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--card-bg-2);
  color: var(--text);
  border: 1.5px solid var(--border);
  font-size: 0.82rem;
  outline: none;
}

.custom-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 14px;
  cursor: pointer;
}

.custom-check input {
  width: auto;
  accent-color: #7C3AED;
}

.chips-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 12px;
  scrollbar-width: none;
}
.chips-row::-webkit-scrollbar { display: none; }

.chip {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: var(--card-bg-2);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.chip.active {
  background: var(--grad-purple);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-dim);
}

.task-list { display: flex; flex-direction: column; gap: 8px; }

.task-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1.5px solid var(--border-soft);
}

.task-card.done { opacity: 0.55; }
.task-card.done .task-text { text-decoration: line-through; color: var(--success); }

.task-checkbox {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: transparent;
  color: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-checkbox.checked {
  background: var(--grad-green);
  border-color: transparent;
  color: #fff;
}

.task-body { flex: 1; min-width: 0; }

.task-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  word-break: break-word;
}

.task-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.7rem;
  color: var(--text-dim);
  margin-top: 4px;
}

.badge-time, .badge-repeat, .badge-custom {
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 700;
}

.badge-time   { background: rgba(34, 197, 94, 0.15); color: var(--success); }
.badge-repeat { background: rgba(76, 111, 255, 0.15); color: #64B5F6; }
.badge-custom { background: rgba(251, 191, 36, 0.15); color: var(--warning); }

.task-del {
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-size: 1rem;
  cursor: pointer;
  padding: 4px;
}
</style>