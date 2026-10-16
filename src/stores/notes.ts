// src/stores/notes.ts
import { defineStore } from 'pinia'
import { shortId } from '@/utils/id'

export interface Note {
  id: string
  title: string
  text: string
  createdAt: number
  updatedAt: number
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    items: [] as Note[]
  }),

  getters: {
    sorted(state): Note[] {
      return [...state.items].sort((a, b) => b.updatedAt - a.updatedAt)
    }
  },

  actions: {
    add(title: string, text: string): Note {
      const note: Note = {
        id: shortId(),
        title: title.trim() || 'Без названия',
        text: text.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      this.items.push(note)
      return note
    },
    update(id: string, patch: Partial<Pick<Note, 'title' | 'text'>>) {
      const n = this.items.find((x) => x.id === id)
      if (!n) return
      if (patch.title !== undefined) n.title = patch.title
      if (patch.text !== undefined) n.text = patch.text
      n.updatedAt = Date.now()
    },
    remove(id: string) {
      this.items = this.items.filter((x) => x.id !== id)
    }
  }
})