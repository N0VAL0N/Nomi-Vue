// src/stores/chat.ts
import { defineStore } from 'pinia'
import { QUOTES } from '@/data/quotes'
import { todayISO } from '@/utils/date'

export interface ChatMessage {
  id: string
  role: 'bot' | 'user'
  text: string
  ts: number
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    open: false,
    messages: [] as ChatMessage[],
    input: '',
    /** Счётчик ответов сегодня (для лимита Premium) */
    usageDate: null as string | null,
    usageCount: 0
  }),

  getters: {
    /** Лимит бесплатных ответов в день */
    dailyLimit(): number {
      return 4
    },
    usageToday(state): number {
      if (state.usageDate !== todayISO()) return 0
      return state.usageCount
    }
  },

  actions: {
    toggle() {
      this.open = !this.open
      if (this.open && this.messages.length === 0) {
        this.pushBot('Привет! Я Номи 👋 Чем помочь?')
      }
    },
    close() {
      this.open = false
    },
    pushUser(text: string) {
      this.messages.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        role: 'user',
        text,
        ts: Date.now()
      })
    },
    pushBot(text: string) {
      this.messages.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        role: 'bot',
        text,
        ts: Date.now()
      })
    },
    bumpUsage() {
      const today = todayISO()
      if (this.usageDate !== today) {
        this.usageDate = today
        this.usageCount = 0
      }
      this.usageCount++
    }
  }
})