// src/stores/reminders.ts
import { defineStore } from 'pinia'

export interface Reminder {
  id: string
  text: string
  date: string
  time: string
  repeat: 'none' | 'daily'
  notified?: boolean
}

export const useRemindersStore = defineStore('reminders', {
  state: () => ({
    items: [] as Reminder[]
  })
})