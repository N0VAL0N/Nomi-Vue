// src/composables/useLoadStats.ts
import { computed } from 'vue'
import { useScheduleStore } from '@/stores/schedule'
import { useHomeworkStore } from '@/stores/homework'
import { useChecklistStore } from '@/stores/checklist'
import { todayISO } from '@/utils/date'

export function useLoadStats() {
  const sch = useScheduleStore()
  const hw = useHomeworkStore()
  const cl = useChecklistStore()

  const lessons = computed(() => {
    const dayId = sch.todayDayId
    return (sch.schedule[dayId] || [])
      .filter((l): l is NonNullable<typeof l> => !!l)
      .map((l) => ({ start: l.start, end: l.end, name: l.subject }))
  })

  const activities = computed(() => {
    const dayId = sch.todayDayId
    return (sch.afterSchool[dayId] || []).map((a) => ({
      start: a.start,
      end: a.end,
      name: a.name
    }))
  })

  const loadMinutes = computed(() => {
    let total = 0
    for (const item of [...lessons.value, ...activities.value]) {
      if (!item.start || !item.end) continue
      const [sh, sm] = item.start.split(':').map(Number)
      const [eh, em] = item.end.split(':').map(Number)
      total += Math.max(0, eh * 60 + em - (sh * 60 + sm))
    }
    return total
  })

  const loadPercent = computed(() =>
    Math.min(100, Math.round((loadMinutes.value / 720) * 100))
  )

  const loadHours = computed(() => Math.floor(loadMinutes.value / 60))
  const loadMins = computed(() => loadMinutes.value % 60)

  return {
    lessons,
    activities,
    loadMinutes,
    loadPercent,
    loadHours,
    loadMins
  }
}