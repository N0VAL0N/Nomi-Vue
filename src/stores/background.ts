// src/stores/background.ts
import { defineStore } from 'pinia'

export type BgTheme = 'default' | 'forest' | 'stars' | 'sunset' | 'ocean'

export const useBackgroundStore = defineStore('background', {
  state: () => ({
    theme: 'default' as BgTheme,
    scrollY: 0,
    scrollMax: 1
  }),

  getters: {
    /** Прогресс скролла 0..1 для затемнения */
    scrollProgress(state): number {
      if (state.scrollMax <= 0) return 0
      return Math.min(1, state.scrollY / state.scrollMax)
    }
  },

  actions: {
    setTheme(t: BgTheme) {
      this.theme = t
    },
    updateScroll(y: number, max: number) {
      this.scrollY = y
      this.scrollMax = max
    }
  }
})