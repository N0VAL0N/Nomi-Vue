// src/composables/useNomiResponse.ts
import { QUOTES } from '@/data/quotes'
import { useHomeworkStore } from '@/stores/homework'
import { useChecklistStore } from '@/stores/checklist'
import { useUserStore } from '@/stores/user'
import { useProgressStore } from '@/stores/progress'
import { plural } from '@/utils/date'

export function useNomiResponse() {
  const hw = useHomeworkStore()
  const cl = useChecklistStore()
  const user = useUserStore()
  const progress = useProgressStore()

  function respond(q: string): string {
    const l = q.toLowerCase().trim()

    // Приветствие
    if (l.includes('привет') || l.includes('хай') || l === 'здарова') {
      return `Привет, ${user.name || 'друг'}! 👋 Чем помочь?`
    }

    // Что делать сегодня
    if (l.includes('план') || l.includes('что делать') || l.includes('сегодня')) {
      const h = hw.pending.length
      const t = cl.pending.length
      return `📋 План на сегодня:<br>1) ${Math.min(h, 2)} ДЗ<br>2) 1 тема<br>3) Таймер 25 мин<br>4) ${Math.min(t, 2)} задач`
    }

    // Прогресс
    if (l.includes('прогресс') || l.includes('статистик')) {
      const done = hw.done.length
      const total = hw.items.length
      return `📊 Твой прогресс:<br>⭐ XP: ${user.xp}<br>🔥 Streak: ${user.streak}<br>📚 ДЗ: ${done}/${total}<br>🎖️ Уровень ${user.xp}`
    }

    // Мотивация
    if (l.includes('мотив') || l.includes('цитат')) {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)]
      return `💭 «${q.text}»<br>— ${q.author}`
    }

    // Каникулы
    if (l.includes('каникул')) {
      if (!progress.vacationStart && !progress.vacationEnd) {
        return '📅 Укажи даты каникул в Настройках!'
      }
      return `🏖 ${progress.vacationLabel}`
    }

    // Учёба
    if (l.includes('учёб') || l.includes('школ')) {
      return `📚 Прогресс учебного года: <b>${progress.studyPercent}%</b>`
    }

    // Шутка
    if (l.includes('шутк')) {
      const jokes = [
        'Почему учебник грустный? Одни проблемы! 📉',
        'Что сказал ноль единице? Ты много значишь! 🔢',
        'Почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 == Dec 25! 🎃'
      ]
      return '😄 ' + jokes[Math.floor(Math.random() * jokes.length)]
    }

    // Совет
    if (l.includes('совет') || l.includes('помог')) {
      const tips = [
        'Начни с простого — это разгонит мозг 🧠',
        'Сделай 5 минут — потом втянешься ⏱️',
        'Убери телефон в другую комнату 📵',
        'Пей воду каждые 30 минут 💧',
        'Разбей большую задачу на 3 маленьких 🎯'
      ]
      return '💡 ' + tips[Math.floor(Math.random() * tips.length)]
    }

    // Устал
    if (l.includes('устал') || l.includes('тяжело')) {
      return '😴 Отдохни 5 минут. Потом вернёшься с силами!'
    }

    // Время
    if (l.includes('время') || l.includes('который час')) {
      const d = new Date()
      return `⏰ ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }

    // Достижения
    if (l.includes('достижен')) {
      return `🏆 Открыто: ${user.achievements.length} из 12<br>🎮 Мемных: ${user.memeAchievements.length} из 42`
    }

    // Premium
    if (l.includes('premium') || l.includes('премиум')) {
      return '💎 Premium даёт: 14+ ответов, безлимит, все темы, скидку −30%!'
    }

    // Спасибо
    if (l.includes('спасибо') || l.includes('благодар')) {
      return '😊 Всегда рад помочь!'
    }

    // Помощь
    if (l.includes('помощь') || l.includes('что умеешь')) {
      return 'Умею: «Что делать?», «Прогресс», «Мотивация», «Шутка», «Совет», «Каникулы»'
    }

    // Шаман
    if (l.includes('шаман') || l.includes('россия мама')) {
      return '🎤 «Россия, мама!» 🇷🇺'
    }

    // По умолчанию
    return '🤔 Спроси: «Что делать?», «Прогресс», «Мотивация», «Совет»'
  }

  return { respond }
}