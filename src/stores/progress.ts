// src/stores/progress.ts
import { defineStore } from 'pinia'
import { todayISO, plural } from '@/utils/date'

export const useProgressStore = defineStore('progress', {
  state: () => ({
    schoolStart: '',
    schoolEnd: '',
    vacationStart: '',
    vacationEnd: ''
  }),

  getters: {
    studyPercent(state): number {
      if (!state.schoolStart || !state.schoolEnd) return 0
      const start = new Date(state.schoolStart + 'T00:00:00').getTime()
      const end = new Date(state.schoolEnd + 'T00:00:00').getTime()
      const now = Date.now()
      const total = end - start
      if (total <= 0) return 0
      return Math.min(100, Math.max(0, Math.round(((now - start) / total) * 100)))
    },

    daysToVacation(state): number {
      if (!state.vacationStart) return -1
      const v = new Date(state.vacationStart + 'T00:00:00').getTime()
      const now = new Date(todayISO() + 'T00:00:00').getTime()
      return Math.max(0, Math.round((v - now) / 86400000))
    },

    onVacation(state): boolean {
      if (!state.vacationStart || !state.vacationEnd) return false
      const now = todayISO()
      return now >= state.vacationStart && now <= state.vacationEnd
    },

    daysOfVacationLeft(state): number {
      if (!state.vacationEnd) return 0
      const end = new Date(state.vacationEnd + 'T00:00:00').getTime()
      const now = new Date(todayISO() + 'T00:00:00').getTime()
      return Math.max(0, Math.round((end - now) / 86400000))
    },

    // ← КЛЮЧЕВОЕ: используем this, а не state
    vacationLabel(): string {
      // this в геттере — это весь стор со всеми геттерами
      if (!this.vacationStart && !this.vacationEnd) return 'Не задано'

      if (this.onVacation) {
        const d = this.daysOfVacationLeft
        return `🎉 Осталось ${d} ${plural(d, ['день', 'дня', 'дней'])}`
      }

      if (this.daysToVacation >= 0) {
        const d = this.daysToVacation
        return `До каникул: ${d} ${plural(d, ['день', 'дня', 'дней'])}`
      }

      return 'Не задано'
    }
  },

  actions: {
    setDates(s: {
      schoolStart?: string
      schoolEnd?: string
      vacationStart?: string
      vacationEnd?: string
    }) {
      if (s.schoolStart !== undefined) this.schoolStart = s.schoolStart
      if (s.schoolEnd !== undefined) this.schoolEnd = s.schoolEnd
      if (s.vacationStart !== undefined) this.vacationStart = s.vacationStart
      if (s.vacationEnd !== undefined) this.vacationEnd = s.vacationEnd
    }
  }
})