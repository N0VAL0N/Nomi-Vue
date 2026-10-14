// src/stores/flash.ts
import { defineStore } from 'pinia'

export interface FlashCard {
  id: string
  q: string
  a: string
  deck: string
}

export const useFlashStore = defineStore('flash', {
  state: () => ({
    cards: [] as FlashCard[],
    activeDeck: 'Общее'
  }),

  getters: {
    decks(state): string[] {
      const set = new Set<string>(['Общее'])
      state.cards.forEach((c) => set.add(c.deck))
      return Array.from(set)
    },
    inDeck(state): FlashCard[] {
      return state.cards.filter((c) => c.deck === state.activeDeck)
    },
    current(state): FlashCard | null {
      return this.inDeck[0] || null
    }
  },

  actions: {
    add(c: FlashCard) {
      this.cards.push(c)
    },
    remove(id: string) {
      const i = this.cards.findIndex((x) => x.id === id)
      if (i >= 0) this.cards.splice(i, 1)
    },
    setDeck(d: string) {
      this.activeDeck = d
    }
  }
})