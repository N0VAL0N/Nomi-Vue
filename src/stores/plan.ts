// src/stores/plan.ts
import { defineStore } from 'pinia'
import { todayISO, addDays } from '@/utils/date'
import { useUserStore } from './user'
import { getAllTopics } from '@/data/topics'

export interface PlanDay {
  date: string
  topicId: string | null
  topicTitle: string
  subject: string
  done: boolean
  testScore: number | null
}

export const usePlanStore = defineStore('plan', {
  state: () => ({
    days: [] as PlanDay[],
    generatedAt: null as string | null
  }),

  getters: {
    /** Сколько дней пройдено */
    progress(state): number {
      if (state.days.length === 0) return 0
      const done = state.days.filter((d) => d.done).length
      return Math.round((done / state.days.length) * 100)
    },

    /** Сегодняшний день плана */
    today(state): PlanDay | null {
      const t = todayISO()
      return state.days.find((d) => d.date === t) || null
    },

    /** План устарел (старше 7 дней) или пустой */
    isStale(state): boolean {
      if (!state.generatedAt) return true
      const daysSince = Math.floor(
        (Date.now() - new Date(state.generatedAt + 'T00:00:00').getTime()) / 86400000
      )
      return daysSince >= 7
    }
  },

  actions: {
    /** Сгенерировать план из проблемных тем */
    generate() {
      const user = useUserStore()
      const allTopics = getAllTopics()

      // 1. Собираем темы из дневника ошибок
      const topicCounts = new Map<string, { topicId: string; title: string; count: number }>()
      Object.values(user.errorDiary).forEach((e) => {
        if (e.solved) return
        const existing = topicCounts.get(e.topicId)
        if (existing) {
          existing.count += e.wrongCount
        } else {
          topicCounts.set(e.topicId, {
            topicId: e.topicId,
            title: e.topicTitle,
            count: e.wrongCount
          })
        }
      })

      // 2. Сортируем по проблемности
      const problemTopics = [...topicCounts.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 7)

      // 3. Если мало проблемных — берём неоткрытые темы класса
      if (problemTopics.length < 7) {
        const viewed = new Set(user.viewedTopics)
        const unviewed = allTopics
          .filter((t) => t.class === user.grade && !viewed.has(t.id))
          .slice(0, 7 - problemTopics.length)
          .map((t) => ({ topicId: t.id, title: t.title, count: 0 }))
        problemTopics.push(...unviewed)
      }

      // 4. Собираем дни
      const start = todayISO()
      this.days = problemTopics.slice(0, 7).map((t, i) => {
        const topic = allTopics.find((x) => x.id === t.topicId)
        return {
          date: addDays(start, i),
          topicId: t.topicId,
          topicTitle: t.title,
          subject: topic?.subject || '',
          done: false,
          testScore: null
        }
      })

      this.generatedAt = start
    },

    /** Отметить день как сделанный */
    markDone(date: string, score: number) {
      const day = this.days.find((d) => d.date === date)
      if (day) {
        day.done = true
        day.testScore = score
      }
    },

    /** Очистить план */
    clear() {
      this.days = []
      this.generatedAt = null
    }
  }
})