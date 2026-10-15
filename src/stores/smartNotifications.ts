// src/stores/smartNotifications.ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useHomeworkStore } from './homework'
import { usePlanStore } from './plan'
import { getAllTopics } from '@/data/topics'
import { todayISO, addDays } from '@/utils/date'

export interface SmartSuggestion {
  id: string
  icon: string
  title: string
  body: string
  priority: number
  actionRoute?: string
}

export const useSmartNotificationsStore = defineStore('smartNotifications', {
  getters: {
    /** Топ-5 умных подсказок на сегодня */
    suggestions(): SmartSuggestion[] {
      const user = useUserStore()
      const hw = useHomeworkStore()
      const plan = usePlanStore()
      const all = getAllTopics()
      const result: SmartSuggestion[] = []
      const today = todayISO()

      // 1. ДЗ на сегодня
      const todayHw = hw.items.filter((h) => !h.done && h.date === today)
      if (todayHw.length > 0) {
        result.push({
          id: 'hw_today',
          icon: '📝',
          title: `Сегодня ${todayHw.length} ДЗ`,
          body: `Первое: ${todayHw[0].subject} — ${todayHw[0].desc.slice(0, 40)}`,
          priority: 100,
          actionRoute: '/hw'
        })
      }

      // 2. Просроченное ДЗ
      const overdue = hw.items.filter((h) => !h.done && h.date < today)
      if (overdue.length > 0) {
        result.push({
          id: 'hw_overdue',
          icon: '⚠️',
          title: `${overdue.length} просроченных ДЗ`,
          body: `Закрой сегодня, чтобы не копилось`,
          priority: 120,
          actionRoute: '/hw'
        })
      }

      // 3. План на сегодня
      const planDay = plan.days.find((d) => d.date === today && !d.done)
      if (planDay) {
        result.push({
          id: 'plan_today',
          icon: '📋',
          title: 'План на сегодня',
          body: planDay.topicTitle,
          priority: 90,
          actionRoute: '/plan'
        })
      }

      // 4. Топ проблемная тема из дневника
      const unsolved = user.unsolvedErrors
      if (unsolved.length > 0) {
        const top = unsolved[0]
        result.push({
          id: 'error_top',
          icon: '🎯',
          title: `Проблемная тема`,
          body: `${top.data.topicTitle} · ошибок: ${top.data.wrongCount}`,
          priority: 80,
          actionRoute: '/errors'
        })
      }

      // 5. Тема, которую давно не открывал
      const viewed = user.viewedTopics
      if (viewed.length > 0) {
        const shuffled = [...viewed].sort(() => Math.random() - 0.5)
        const t = all.find((x) => x.id === shuffled[0])
        if (t) {
          result.push({
            id: 'review_old',
            icon: '🧊',
            title: 'Пора повторить',
            body: t.title,
            priority: 60,
            actionRoute: '/fridge'
          })
        }
      }

      // 6. Streak под угрозой
      if (user.streak > 0 && user.lastCompletedDate !== today) {
        result.push({
          id: 'streak_risk',
          icon: '🔥',
          title: `Streak ${user.streak} под угрозой`,
          body: 'Закрой хотя бы одну задачу',
          priority: 110,
          actionRoute: '/checklist'
        })
      }

      // 7. Генерация плана
      if (plan.days.length === 0 && user.errorDiary && Object.keys(user.errorDiary).length > 0) {
        result.push({
          id: 'plan_generate',
          icon: '✨',
          title: 'Собери план на 7 дней',
          body: 'Из твоих проблемных тем',
          priority: 70,
          actionRoute: '/plan'
        })
      }

      return result.sort((a, b) => b.priority - a.priority).slice(0, 5)
    },

    /** Главная подсказка — для отображения в FAB Номи или баннера */
    topSuggestion(): SmartSuggestion | null {
      return this.suggestions[0] || null
    }
  }
})