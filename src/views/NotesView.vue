<!-- src/views/NotesView.vue -->
<template>
  <div class="notes-view">
    <div class="header">
      <div class="title">📝 Заметки</div>
      <button v-ripple class="btn-add" @click="openNew">
        <AppIcon name="plus" :size="18" />
        <span>Новая</span>
      </button>
    </div>

    <!-- Пусто -->
    <div v-if="notes.sorted.length === 0" class="empty">
      <div class="empty-icon">📝</div>
      <div class="empty-title">Заметок пока нет</div>
      <div class="empty-sub">Записывай идеи, конспекты и напоминания</div>
    </div>

    <!-- Список -->
    <div v-else class="notes-list">
      <div
        v-for="n in notes.sorted"
        :key="n.id"
        class="note-card"
        @click="openEdit(n)"
      >
        <div class="note-head">
          <div class="note-title">{{ n.title }}</div>
          <button class="note-del" @click.stop="confirmDelete(n.id)">
            <AppIcon name="close" :size="14" />
          </button>
        </div>
        <div v-if="n.text" class="note-preview">{{ n.text.slice(0, 100) }}{{ n.text.length > 100 ? '…' : '' }}</div>
        <div class="note-date">{{ formatDateRelative(n.updatedAt) }}</div>
      </div>
    </div>

    <!-- Модалка создания / редактирования -->
    <AppModal v-model="modalOpen">
      <template #title>{{ editingId ? 'Редактировать заметку' : 'Новая заметка' }}</template>

      <FormField label="Заголовок">
        <input v-model="form.title" type="text" maxlength="60" placeholder="Например: Конспект по физике" />
      </FormField>

      <FormField label="Текст">
        <textarea v-model="form.text" rows="6" placeholder="Текст заметки..." />
      </FormField>

      <div class="voice-row">
        <MicButton @result="onVoiceResult" />
        <span class="voice-hint">
          {{ form.text ? '🎤 Дописать голосом' : '🎤 Надиктовать заметку' }}
        </span>
      </div>

      <button class="btn-primary" @click="save">
        <AppIcon name="check" :size="18" />
        <span>Сохранить</span>
      </button>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useNotesStore, type Note } from '@/stores/notes'
import { useToast } from '@/composables/useToast'
import { vRipple } from '@/directives/ripple'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppModal from '@/components/ui/AppModal.vue'
import FormField from '@/components/ui/FormField.vue'
import MicButton from '@/components/ui/MicButton.vue'

const notes = useNotesStore()
const toast = useToast()

const modalOpen = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  title: '',
  text: ''
})

function openNew() {
  editingId.value = null
  form.title = ''
  form.text = ''
  modalOpen.value = true
}

function openEdit(n: Note) {
  editingId.value = n.id
  form.title = n.title
  form.text = n.text
  modalOpen.value = true
}

function save() {
  if (!form.title.trim() && !form.text.trim()) {
    toast.error('Заполни хотя бы одно поле')
    return
  }
  if (editingId.value) {
    notes.update(editingId.value, { title: form.title, text: form.text })
    toast.success('✅ Обновлено')
  } else {
    notes.add(form.title, form.text)
    toast.success('✅ Создано')
  }
  modalOpen.value = false
}

function confirmDelete(id: string) {
  if (!confirm('Удалить заметку?')) return
  notes.remove(id)
  toast.info('🗑 Удалено')
}

function onVoiceResult(text: string) {
  form.text = form.text ? `${form.text} ${text}` : text
}

function formatDateRelative(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'только что'
  if (min < 60) return `${min} мин назад`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `${hours} ч назад`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} дн назад`
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.notes-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text);
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  background: var(--grad-purple);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}

.empty-icon { font-size: 3rem; margin-bottom: 12px; }
.empty-title { font-size: 1rem; font-weight: 800; color: var(--text); margin-bottom: 6px; }
.empty-sub { font-size: 0.82rem; }

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-card {
  padding: 14px;
  border-radius: var(--radius);
  background: var(--card-bg);
  border: 1.5px solid var(--border-soft);
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
}

.note-card:active {
  transform: scale(0.98);
  border-color: var(--primary);
}

.note-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 6px;
}

.note-title {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-del {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.note-preview {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
  word-break: break-word;
}

.note-date {
  font-size: 0.7rem;
  color: var(--text-dim);
  font-weight: 600;
}

.voice-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -6px 0 14px;
}

.voice-hint {
  font-size: 0.78rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
</style>