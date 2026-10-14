// src/stores/fridge.ts
import { defineStore } from 'pinia'
import { todayISO, addDays } from '@/utils/date'

export interface FridgeItem {
  topicId: string
  title: string
  nextReview: string
  level: number
}

export const SRS_INTERVALS = [1, 3, 7, 14, 30, 60]

export const useFridgeStore = defineStore('fridge', {
  state: () => ({
    items: [] as FridgeItem[]
  }),

  actions: {
    add(topicId: string, title: string) {
      if (this.items.some((f) => f.topicId === topicId)) return false
      this.items.push({
        topicId,
        title,
        nextReview: addDays(todayISO(), 1),
        level: 0
      })
      return true
    },
    remove(topicId: string) {
      this.items = this.items.filter((f) => f.topicId !== topicId)
    },
    review(topicId: string) {
      const item = this.items.find((f) => f.topicId === topicId)
      if (!item) return
      item.level = Math.min(item.level + 1, SRS_INTERVALS.length - 1)
      item.nextReview = addDays(todayISO(), SRS_INTERVALS[item.level])
    }
  },

  getters: {
    dueToday(state): FridgeItem[] {
      const today = todayISO()
      return state.items.filter((f) => f.nextReview <= today)
    }
  }
})