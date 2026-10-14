// src/stores/achievements.ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useHomeworkStore } from './homework'
import { useChecklistStore } from './checklist'
import { useFlashStore } from './flash'
import { usePetStore } from './pet'
import { useEconomy } from '@/composables/useEconomy'
import { useToast } from '@/composables/useToast'
import { useConfetti } from '@/composables/useConfetti'
import { useAvatarStore } from './avatar'
import { todayISO, addDays } from '@/utils/date'
import {
  SIMPLE_ACHIEVEMENTS,
  MEME_ACHIEVEMENTS,
  RARITY,
  type AchievementDef,
  type AchievementStats
} from '@/data/achievements'

export const useAchievementsStore = defineStore('achievements', {
  state: () => ({
    lastCheck: 0
  }),

  actions: {
    buildStats(): AchievementStats {
      const user = useUserStore()
      const hw = useHomeworkStore()
      const cl = useChecklistStore()
      const flash = useFlashStore()
      const pet = usePetStore()

      return {
        hwDone: hw.done.length,
        streak: user.streak,
        xp: user.xp,
        pomodoro: user.pomodoroCount,
        viewedTopics: user.viewedTopics.length,
        flashCompleted: user.completedFlashCards.length,
        isPremium: user.isPremium,
        petLevel: pet.pet.level,
        homework: hw.items.map((h) => ({ done: h.done, grade: h.grade, priority: h.priority, date: h.date })),
        checklist: cl.items.map((t) => ({ text: t.text })),
        flashCards: flash.cards.map((c) => ({ q: c.q, a: c.a })),
        activeDays: user.activeDays,
        lastCompletedDate: user.lastCompletedDate,
        today: todayISO(),
        addDays,
        usedVoiceInput: user.usedVoiceInput,
        statsViewsToday: user.statsViewsToday,
        shamanSung: user.shamanSung,
        solvedProblems: user.solvedProblems,
        reviewedMistakes: 0,
        highDoneNoReminder: 0,
        longOverdueDone: 0,
        deletedStressTasks: 0,
        restoredTasks: 0,
        activeDaysCount: Object.keys(user.activeDays).length,
        voiceInputsToday: 0,
        completedFlashCards: user.completedFlashCards.length,
        pomodoroUnusualPlace: 0,
        ignoredAppCount: 0,
        comeBackAfter3Days: 0,
        silentStudySessions: 0,
        cheatedTasks: 0,
        musicDuringStudy: 0,
        danceBreaks: 0,
        hardProblemsSolved: 0,
        solvedWithoutHint: 0,
        reviewedOldCards: 0,
        absurdMoments: 0,
        beatOwnRecord: 0
      }
    },

    check() {
      const user = useUserStore()
      const economy = useEconomy()
      const toast = useToast()
      const { confetti } = useConfetti()
      const avatar = useAvatarStore()
      const stats = this.buildStats()

      // Обычные
      SIMPLE_ACHIEVEMENTS.forEach((a) => {
        if (!user.achievements.includes(a.id) && a.check(stats)) {
          user.achievements.push(a.id)
          economy.addXP(a.xp)
          setTimeout(() => {
            toast.gold(`🏆 ${a.name}!`)
            confetti(50)
            avatar.setEmotion('excited', 1500)
          }, 400)
        }
      })

      // Мемные
      MEME_ACHIEVEMENTS.forEach((m) => {
        if (!user.memeAchievements.includes(m.id)) {
          try {
            if (m.check(stats)) {
              user.memeAchievements.push(m.id)
              economy.addXP(m.xp)
              const r = RARITY[m.rarity]
              setTimeout(() => {
                toast.show(`${r.icon} ${m.icon} ${m.name} · +${m.xp} XP`, m.rarity === 'legendary' ? 'gold' : 'success')
                confetti(m.rarity === 'legendary' ? 90 : 40, m.rarity === 'legendary')
                avatar.setEmotion('excited', 1800)
              }, 600)
            }
          } catch {
            // safety
          }
        }
      })
    }
  }
})