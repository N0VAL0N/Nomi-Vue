// src/composables/useNotifications.ts
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { useUiStore } from '@/stores/ui'
import { useSmartNotificationsStore } from '@/stores/smartNotifications'

export function useNotifications() {
  const ui = useUiStore()

  /** Проверить текущий статус */
  async function checkPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      // В браузере — Web Notifications
      if (!('Notification' in window)) return false
      return Notification.permission === 'granted'
    }
    try {
      const res = await LocalNotifications.checkPermissions()
      return res.display === 'granted'
    } catch {
      return false
    }
  }

  /** Запросить разрешение */
  async function requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      if (!('Notification' in window)) return false
      const res = await Notification.requestPermission()
      return res === 'granted'
    }
    try {
      const res = await LocalNotifications.requestPermissions()
      return res.display === 'granted'
    } catch {
      return false
    }
  }

  /** Запланировать уведомление */
  async function schedule(title: string, body: string, at: Date, id?: number) {
    if (!ui.notifications) return

    if (!Capacitor.isNativePlatform()) {
      // Web fallback — Notification API
      if (Notification.permission === 'granted' && at.getTime() <= Date.now() + 1000) {
        new Notification(title, { body })
      }
      return
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: id ?? Math.floor(Date.now() / 1000),
            title,
            body,
            schedule: { at },
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#7C3AED'
          }
        ]
      })
    } catch (e) {
      console.warn('[notifications] schedule failed', e)
    }
  }

  /** Запланировать напоминания из state.reminders */
  async function scheduleAllReminders(reminders: { id: string; text: string; date: string; time: string; repeat: string }[]) {
    if (!Capacitor.isNativePlatform()) return

    // Очищаем старые
    try {
      const pending = await LocalNotifications.getPending()
      if (pending.notifications.length) {
        await LocalNotifications.cancel({ notifications: pending.notifications })
      }
    } catch {}

    // Ставим новые
    for (const r of reminders) {
      const dt = new Date(`${r.date}T${r.time}:00`)
      if (dt.getTime() <= Date.now()) continue

      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: hashId(r.id),
              title: 'Номи · Напоминание',
              body: r.text,
              schedule: {
                at: dt,
                repeats: r.repeat === 'daily',
                every: r.repeat === 'daily' ? 'day' : undefined
              } as any,
            }
          ]
        })
      } catch (e) {
        console.warn('[notifications] reminder failed', e)
      }
    }
  }

  async function scheduleDailySuggestion() {
    const smart = useSmartNotificationsStore()
    const top = smart.topSuggestion
    if (!top) return

    const now = new Date()
    const target = new Date()
    target.setHours(16, 0, 0, 0)
    if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1)
    }

    await schedule(top.title, top.body, target, 999)
}

  return { checkPermission, requestPermission, schedule, scheduleAllReminders, scheduleDailySuggestion }
}

function hashId(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h) % 2147483647
}

