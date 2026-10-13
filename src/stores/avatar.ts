// src/stores/avatar.ts
import { defineStore } from 'pinia'

export type Emotion = 'happy' | 'excited' | 'love' | 'eating' | 'angry' | 'sleepy'
export type LookTab = 'horns' | 'eyes' | 'noses' | 'mouths'

export const useAvatarStore = defineStore('avatar', {
  state: () => ({
    emotion: 'happy' as Emotion,
    emotionTimer: null as ReturnType<typeof setTimeout> | null,
    active: {
      horns: 'classic',
      eyes: 'round',
      noses: 'small',
      mouths: 'soft'
    },
    owned: {
      horns: ['classic'] as string[],
      eyes: ['round'] as string[],
      noses: ['small'] as string[],
      mouths: ['soft'] as string[]
    }
  }),

  actions: {
    setEmotion(e: Emotion, duration = 1500) {
      if (this.emotionTimer) clearTimeout(this.emotionTimer)
      this.emotion = e
      if (duration > 0) {
        this.emotionTimer = setTimeout(() => {
          this.emotion = 'happy'
        }, duration)
      }
    },
    isOwned(tab: LookTab, id: string): boolean {
      return this.owned[tab].includes(id)
    },
    own(tab: LookTab, id: string) {
      if (!this.owned[tab].includes(id)) this.owned[tab].push(id)
    },
    setActive(tab: LookTab, id: string) {
      this.active[tab] = id
    }
  }
})