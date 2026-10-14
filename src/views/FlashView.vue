<!-- src/views/FlashView.vue -->
<template>
  <div class="flash-view">
    <div class="header">
      <div class="title">🎴 Карточки · {{ flash.cards.length }}</div>
      <button class="btn-add" @click="openCreate">+ Создать</button>
    </div>

    <!-- Колоды -->
    <div class="deck-chips">
      <button
        v-for="d in flash.decks"
        :key="d"
        class="deck-chip"
        :class="{ active: flash.activeDeck === d }"
        @click="flash.setDeck(d)"
      >
        {{ d }}
      </button>
    </div>

    <!-- Карточка -->
    <div v-if="flash.current" class="flash-active">
      <div class="card-wrap">
        <div
          class="flash-card"
          :class="{ flipped }"
          @click="flipped = !flipped"
        >
          <div class="side front">
            <div class="label">ВОПРОС</div>
            <div class="content">{{ flash.current.q }}</div>
          </div>
          <div class="side back">
            <div class="label">ОТВЕТ</div>
            <div class="content">{{ flash.current.a }}</div>
          </div>
        </div>
      </div>

      <div class="answer-row">
        <input
          v-model="userAnswer"
          type="text"
          placeholder="Напиши ответ..."
          @keydown.enter="check"
        />
        <button @click="check">Проверить</button>
      </div>

      <div v-if="result" class="result" :class="result.ok ? 'correct' : 'wrong'">
        {{ result.msg }}
      </div>
    </div>

    <div v-else class="empty">🎴 Карточек пока нет</div>

    <!-- Модалка -->
    <AppModal v-model="modalOpen">
      <template #title>🎴 Новая карточка</template>
      <FormField label="Вопрос">
        <textarea v-model="form.q" maxlength="200" />
      </FormField>
      <FormField label="Ответ">
        <textarea v-model="form.a" maxlength="300" />
      </FormField>
      <FormField label="Колода">
        <input v-model="form.deck" type="text" maxlength="30" />
      </FormField>
      <button class="btn-primary" @click="save">💾 Сохранить</button>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useFlashStore } from '@/stores/flash'
import { useUserStore } from '@/stores/user'
import { useEconomy } from '@/composables/useEconomy'
import { useToast } from '@/composables/useToast'
import { useSound } from '@/composables/useSound'
import { useConfetti } from '@/composables/useConfetti'
import { shortId } from '@/utils/id'
import AppModal from '@/components/ui/AppModal.vue'
import FormField from '@/components/ui/FormField.vue'

const flash = useFlashStore()
const user = useUserStore()
const economy = useEconomy()
const toast = useToast()
const sound = useSound()
const { confetti } = useConfetti()

const flipped = ref(false)
const userAnswer = ref('')
const result = ref<{ ok: boolean; msg: string } | null>(null)
const modalOpen = ref(false)

const form = reactive({ q: '', a: '', deck: 'Общее' })

function openCreate() {
  form.q = ''
  form.a = ''
  form.deck = flash.activeDeck || 'Общее'
  modalOpen.value = true
}

function save() {
  if (!form.q.trim() || !form.a.trim()) {
    toast.error('Заполните поля')
    return
  }
  flash.add({
    id: shortId(),
    q: form.q.trim(),
    a: form.a.trim(),
    deck: form.deck.trim() || 'Общее'
  })
  modalOpen.value = false
  toast.success('✅ Создано')
}

function check() {
  const card = flash.current
  if (!card) return
  const ua = userAnswer.value.trim().toLowerCase()
  const ca = card.a.trim().toLowerCase()
  if (!ua) {
    toast.warning('Напиши ответ')
    return
  }
  if (ua === ca || (ca.includes(ua) && ua.length >= 3)) {
    result.value = { ok: true, msg: '✅ Верно! +10 XP' }
    economy.addXP(10)
    user.completedFlashCards.push(card.id)
    sound.success()
    confetti(30)
    setTimeout(() => {
      flash.remove(card.id)
      flipped.value = false
      userAnswer.value = ''
      result.value = null
    }, 1400)
  } else {
    result.value = { ok: false, msg: `❌ Ответ: «${card.a.charAt(0)}...»` }
  }
}
</script>

<style scoped>
.flash-view { padding: 16px; max-width: 720px; margin: 0 auto; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.title { font-size: 1.1rem; font-weight: 800; color: var(--text, #E6ECFF); }

.btn-add {
  padding: 10px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7C3AED, #6366F1);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
}

.deck-chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 14px;
  scrollbar-width: none;
}

.deck-chips::-webkit-scrollbar { display: none; }

.deck-chip {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 12px;
  background: var(--card-bg-2, #161E30);
  border: 1.5px solid var(--border, #1E2740);
  color: var(--text-secondary, #8B95B0);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.deck-chip.active {
  background: linear-gradient(135deg, #7C3AED, #6366F1);
  color: #fff;
  border-color: transparent;
}

.card-wrap {
  perspective: 1200px;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  height: 300px;
}

.flash-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  cursor: pointer;
}

.flash-card.flipped { transform: rotateY(180deg); }

.side {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  background: var(--card-bg, #131A2A);
  border: 2px solid var(--border, #1E2740);
  border-radius: 22px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.side.back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1));
}

.label {
  font-size: 0.72rem;
  font-weight: 800;
  color: #A78BFA;
  letter-spacing: 0.15em;
  margin-bottom: 14px;
}

.content {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text, #E6ECFF);
  line-height: 1.5;
}

.answer-row {
  display: flex;
  gap: 8px;
  max-width: 400px;
  margin: 14px auto 0;
}

.answer-row input {
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--card-bg-2, #161E30);
  color: var(--text, #E6ECFF);
  border: 1.5px solid var(--border, #1E2740);
  font-size: 0.95rem;
  outline: none;
}

.answer-row button {
  padding: 12px 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7C3AED, #6366F1);
  color: #fff;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.result {
  max-width: 400px;
  margin: 12px auto 0;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 700;
  text-align: center;
}

.result.correct { background: rgba(34, 197, 94, 0.15); color: #22C55E; }
.result.wrong   { background: rgba(239, 68, 68, 0.12); color: #EF4444; }

.empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-dim, #5A6478);
}

.btn-primary {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7C3AED, #6366F1);
  color: #fff;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: 8px;
}
</style>