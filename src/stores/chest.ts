// src/stores/chest.ts
import { defineStore } from 'pinia'
import { todayISO } from '@/utils/date'

export const useChestStore = defineStore('chest', {
  state: () => ({
    openedDate: null as string | null
  }),

  getters: {
    isOpenToday(state): boolean {
      return state.openedDate === todayISO()
    }
  },

  actions: {
    open(): number {
      if (this.isOpenToday) return 0
      this.openedDate = todayISO()
      // Случайная награда
      const rewards = [30, 50, 100]
      return rewards[Math.floor(Math.random() * rewards.length)]
    }
  }
})