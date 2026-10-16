<!-- src/components/chat/NomiChat.vue -->
<template>
  <Teleport to="body">
    <Transition name="chat">
      <div v-if="chat.open" class="chat-overlay" @click.self="chat.close">
        <div class="chat-panel glass">
          <!-- Заголовок -->
          <div class="chat-head">
            <NomiAvatar :size="40" />
            <div class="chat-head-info">
              <div class="chat-title">Номи</div>
              <div class="chat-sub">Онлайн</div>
            </div>
            <button v-ripple class="chat-close" @click="chat.close">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <!-- Сообщения -->
          <div ref="bodyRef" class="chat-body">
            <div
              v-for="m in chat.messages"
              :key="m.id"
              class="chat-msg"
              :class="m.role"
              v-html="m.text"
            />
          </div>

          <!-- Быстрые -->
          <div class="chat-quick">
            <button v-ripple @click="quick('Что мне делать сегодня?')">Что делать?</button>
            <button v-ripple @click="quick('Как мой прогресс?')">Прогресс</button>
            <button v-ripple @click="quick('Мотивируй меня')">Мотивация</button>
            <button v-ripple @click="quick('Расскажи шутку')">Шутка</button>
            <button v-ripple @click="quick('Дай совет')">Совет</button>
          </div>

          <!-- Ввод -->
          <div class="chat-input-row">
            <input
              ref="inputRef"
              v-model="chat.input"
              type="text"
              placeholder="Спроси Номи..."
              maxlength="200"
              @keydown.enter.prevent="send"
              @focus="onFocus"
              @blur="onBlur"
            />
            <MicButton
              v-if="showMic"
              @result="onVoiceResult"
            />
            <button v-ripple class="chat-send" @click="send">
              <AppIcon name="message" :size="18" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useNomiResponse } from '@/composables/useNomiResponse'
import { useToast } from '@/composables/useToast'
import { vRipple } from '@/directives/ripple'
import AppIcon from '@/components/ui/AppIcon.vue'
import NomiAvatar from '@/components/nomi/NomiAvatar.vue'
import MicButton from '@/components/ui/MicButton.vue'


const chat = useChatStore()
const user = useUserStore()
const nomi = useNomiResponse()
const toast = useToast()


const bodyRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const showMic = ref(false)

async function scrollBottom() {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}

function send() {
  const text = chat.input.trim()
  if (!text) return

  // Лимит для не-Premium
  if (!user.isPremium && chat.usageToday >= chat.dailyLimit) {
    toast.warning('💎 Лимит ответов на сегодня')
    return
  }

  chat.pushUser(text)
  chat.input = ''
  chat.bumpUsage()

  setTimeout(() => {
    const answer = nomi.respond(text)
    chat.pushBot(answer)
    scrollBottom()
  }, 600)

  scrollBottom()
}

function onFocus() {
  // Показываем микрофон, если поле пустое
  if (!chat.input.trim()) showMic.value = true
}

function onBlur() {
  // Скрываем только если не пустое
  if (chat.input.trim()) showMic.value = false
}

function onVoiceResult(text: string) {
  chat.input = text
}

function quick(text: string) {
  chat.input = text
  send()
}

watch(() => chat.messages.length, scrollBottom)
</script>

<style scoped>
.chat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 9, 16, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 700px) {
  .chat-overlay { align-items: center; }
}

.chat-panel {
  width: 100%;
  max-width: 540px;
  height: 80vh;
  max-height: 700px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

@media (min-width: 700px) {
  .chat-panel {
    border-radius: var(--radius-lg);
    height: 80vh;
  }
}

.chat-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft);
}

.chat-head-info { flex: 1; }

.chat-title {
  font-weight: 800;
  font-size: 1rem;
  color: var(--text);
}

.chat-sub {
  font-size: 0.72rem;
  color: var(--success);
  font-weight: 600;
}

.chat-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-msg {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.88rem;
  line-height: 1.5;
  word-break: break-word;
}

.chat-msg.bot {
  background: var(--card-bg-2);
  border: 1px solid var(--border-soft);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  color: var(--text);
}

.chat-msg.user {
  background: var(--grad-purple);
  color: #fff;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.chat-quick {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 10px 20px;
  border-top: 1px solid var(--border-soft);
  scrollbar-width: none;
}

.chat-quick::-webkit-scrollbar { display: none; }

.chat-quick button {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.chat-input-row {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--border-soft);
  align-items: center;
}

.chat-input-row input {
  flex: 1;
  padding: 10px 14px;
  font-size: 0.9rem;
  border-radius: var(--radius-full);
}

.chat-send {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--grad-purple);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Переходы */
.chat-enter-active, .chat-leave-active {
  transition: opacity 0.25s;
}
.chat-enter-from, .chat-leave-to {
  opacity: 0;
}
</style>