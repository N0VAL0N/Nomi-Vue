// src/data/achievements.ts

export type Rarity = 'common' | 'rare' | 'legendary'

export interface RarityDef {
  name: string
  color: string
  icon: string
}

export const RARITY: Record<Rarity, RarityDef> = {
  common:    { name: 'Обычное',     color: '#22C55E', icon: '🟢' },
  rare:      { name: 'Редкое',      color: '#8B5CF6', icon: '🟣' },
  legendary: { name: 'Легендарное', color: '#FBBF24', icon: '🟡' }
}

export interface AchievementStats {
  hwDone: number
  streak: number
  xp: number
  pomodoro: number
  viewedTopics: number
  flashCompleted: number
  isPremium: boolean
  petLevel: number
  homework: { done: boolean; grade: number | null; priority: string; date: string }[]
  checklist: { text: string }[]
  flashCards: { q: string; a: string }[]
  activeDays: Record<string, number>
  lastCompletedDate: string | null
  today: string
  addDays: (iso: string, days: number) => string
  usedVoiceInput: boolean
  statsViewsToday: number
  shamanSung: number
  solvedProblems: string[]
  reviewedMistakes: number
  highDoneNoReminder: number
  longOverdueDone: number
  deletedStressTasks: number
  restoredTasks: number
  activeDaysCount: number
  voiceInputsToday: number
  completedFlashCards: number
  pomodoroUnusualPlace: number
  ignoredAppCount: number
  comeBackAfter3Days: number
  silentStudySessions: number
  cheatedTasks: number
  musicDuringStudy: number
  danceBreaks: number
  hardProblemsSolved: number
  solvedWithoutHint: number
  reviewedOldCards: number
  absurdMoments: number
  beatOwnRecord: number
}

export interface AchievementDef {
  id: string
  icon: string
  name: string
  title?: string
  desc: string
  rarity: Rarity
  xp: number
  check: (s: AchievementStats) => boolean
}

/* ---------- Обычные достижения ---------- */

export const SIMPLE_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_hw', name: 'Первый шаг',    icon: '🌱', desc: 'Выполнить 1 ДЗ',   rarity: 'common',    xp: 15, check: (s) => s.hwDone >= 1 },
  { id: 'hw_10',    name: 'Десятка',       icon: '📚', desc: '10 ДЗ',            rarity: 'common',    xp: 15, check: (s) => s.hwDone >= 10 },
  { id: 'hw_50',    name: 'Полтинник',     icon: '🏆', desc: '50 ДЗ',            rarity: 'rare',      xp: 15, check: (s) => s.hwDone >= 50 },
  { id: 'streak_7', name: 'Неделя силы',   icon: '🔥', desc: 'Streak 7',         rarity: 'rare',      xp: 15, check: (s) => s.streak >= 7 },
  { id: 'streak_30',name: 'Месяц огня',    icon: '💎', desc: 'Streak 30',        rarity: 'legendary', xp: 15, check: (s) => s.streak >= 30 },
  { id: 'lvl_5',    name: 'Мастер',        icon: '🎓', desc: '1500 XP',          rarity: 'rare',      xp: 15, check: (s) => s.xp >= 1500 },
  { id: 'pomo_10',  name: 'Помидорчик',    icon: '🍅', desc: '10 сессий',        rarity: 'common',    xp: 15, check: (s) => s.pomodoro >= 10 },
  { id: 'topic_5',  name: 'Исследователь', icon: '🔍', desc: '5 тем',            rarity: 'common',    xp: 15, check: (s) => s.viewedTopics >= 5 },
  { id: 'premium',  name: 'Premium!',      icon: '💎', desc: 'Купить Premium',   rarity: 'rare',      xp: 15, check: (s) => s.isPremium },
  { id: 'xp_1000',  name: 'Кладоискатель', icon: '🎁', desc: '1000 XP',          rarity: 'common',    xp: 15, check: (s) => s.xp >= 1000 },
  { id: 'friend_dragon', name: 'Друг дракона', icon: '🐉', desc: 'Питомец 5 ур.', rarity: 'rare',      xp: 15, check: (s) => s.petLevel >= 5 },
  { id: 'flash_10', name: 'Карточный мастер', icon: '🎴', desc: '10 карточек',  rarity: 'common',    xp: 15, check: (s) => s.flashCompleted >= 10 }
]

/* ---------- Мемные достижения ---------- */

export const MEME_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'm01', icon: '👑', name: 'Поздравляю, ты её сломал', title: 'Ты победил',  desc: 'Просрочить ДЗ, но отметить выполненным', rarity: 'rare',      xp: 15,  check: (s) => s.homework.some((h) => h.done && h.date && h.date < s.today) },
  { id: 'm02', icon: '🪑', name: 'Сидим, не рыпаемся',        title: 'Сидим',       desc: 'Streak 3+, но день неактивен',           rarity: 'rare',      xp: 30,  check: (s) => s.streak >= 3 && s.lastCompletedDate === s.addDays(s.today, -1) },
  { id: 'm03', icon: '🚕', name: 'Мама, вызывай такси',       title: 'Такси едет',  desc: '3+ просроченных ДЗ',                    rarity: 'common',    xp: 20,  check: (s) => s.homework.filter((h) => !h.done && h.date < s.today).length >= 3 },
  { id: 'm04', icon: '🎮', name: 'Я в эти игры уже играл',    title: 'Ветеран',     desc: 'Повторить квест',                       rarity: 'rare',      xp: 50,  check: () => false },
  { id: 'm05', icon: '🔨', name: 'Ты её сломал',              title: 'Сломал',      desc: 'Решить сложную задачу',                 rarity: 'legendary', xp: 80,  check: (s) => s.hardProblemsSolved >= 1 },
  { id: 'm06', icon: '🐐', name: 'Козёл по имени Яша',        title: 'Яша',         desc: 'Голосовой ввод',                        rarity: 'common',    xp: 25,  check: (s) => s.usedVoiceInput },
  { id: 'm07', icon: '✨', name: 'Мага, сияй',                title: 'Сияй',        desc: 'Ночная задача',                         rarity: 'rare',      xp: 70,  check: () => false },
  { id: 'm08', icon: '🐔', name: 'Чикен Джокей',              title: 'Чикен',       desc: '5 активностей за день',                 rarity: 'rare',      xp: 60,  check: (s) => (s.activeDays[s.today] || 0) >= 5 },
  { id: 'm09', icon: '🐊', name: 'Бомбардиро Крокодило',      title: 'Крокодило',   desc: '5 длинных карточек',                    rarity: 'rare',      xp: 100, check: (s) => s.flashCards.filter((c) => c.q.length > 40).length >= 5 },
  { id: 'm10', icon: '🤔', name: 'Окак',                      title: 'Окак',        desc: 'Статистика 3 раза за день',             rarity: 'common',    xp: 40,  check: (s) => s.statsViewsToday >= 3 },
  { id: 'm11', icon: '👹', name: 'Лабубу',                    title: 'Лабубу',      desc: 'Купить 3 скина питомца',                rarity: 'rare',      xp: 80,  check: () => false },
  { id: 'm12', icon: '🧍', name: 'Мы не лошади, мы люди',     title: 'Человек',     desc: 'Решить задачу без подсказки',           rarity: 'rare',      xp: 90,  check: (s) => s.solvedWithoutHint >= 1 },
  { id: 'm13', icon: '👓', name: 'Умный человек в очках',     title: 'Очки',        desc: '2 помодоро',                            rarity: 'rare',      xp: 80,  check: (s) => s.pomodoro >= 2 },
  { id: 'm14', icon: '🎃', name: 'Скебоб',                    title: 'Скебоб',      desc: 'Восстановить задачу',                   rarity: 'common',    xp: 50,  check: (s) => s.restoredTasks >= 1 },
  { id: 'm15', icon: '🥒', name: 'Дикий огурец',              title: 'Огурец',      desc: 'Повторить 10 ошибок',                   rarity: 'rare',      xp: 100, check: (s) => s.reviewedMistakes >= 10 },
  { id: 'm16', icon: '💎', name: 'Смерть в нищете',           title: 'Покой',       desc: 'Выполнить все 🔴 ДЗ за день',           rarity: 'legendary', xp: 200, check: (s) => { const h = s.homework.filter((x) => x.priority === 'high'); return h.length > 0 && h.every((x) => x.done) } },
  { id: 'm17', icon: '⌚', name: 'Тётя, а котлы?',            title: 'Котлы',       desc: '🔴 ДЗ без напоминаний',                 rarity: 'rare',      xp: 100, check: (s) => s.highDoneNoReminder >= 1 },
  { id: 'm18', icon: '6️⃣7️⃣', name: 'Сикс-севен',           title: '6-7',         desc: 'Streak 67',                             rarity: 'legendary', xp: 670, check: (s) => s.streak >= 67 },
  { id: 'm19', icon: '🦁', name: 'Черемша',                   title: 'Черемша',     desc: '5 карточек про СССР',                   rarity: 'rare',      xp: 150, check: (s) => s.flashCards.filter((c) => /ссср|совет/i.test(c.q + ' ' + c.a)).length >= 5 },
  { id: 'm20', icon: '🚫', name: 'Стоп, мне неприятно',       title: 'Границы',     desc: 'Удалить стрессовую задачу',             rarity: 'common',    xp: 20,  check: (s) => s.deletedStressTasks >= 1 },
  { id: 'm21', icon: '🥧', name: 'Чоко и пай',                title: 'Мур-мур',     desc: '5 карточек без использования',          rarity: 'common',    xp: 40,  check: (s) => s.flashCards.length >= 5 && s.completedFlashCards === 0 },
  { id: 'm22', icon: '🧮', name: 'Что этот Дидди блад...',    title: 'Дидди блад',  desc: 'Вернуться после перерыва',              rarity: 'common',    xp: 15,  check: () => false },
  { id: 'm23', icon: '🚗', name: 'Папа едет в Волгоград',     title: 'Волгоград',   desc: 'Закрыть задачу недельной давности',     rarity: 'rare',      xp: 70,  check: (s) => s.longOverdueDone >= 1 },
  { id: 'm24', icon: '📞', name: 'Возьми телефон, детка',     title: 'Возьми',      desc: 'Вернуться после игнора',                rarity: 'common',    xp: 30,  check: (s) => s.ignoredAppCount >= 1 },
  { id: 'm25', icon: '🧛', name: 'Вампир крадётся тихо',      title: 'Тихо-тихо',   desc: 'Тихая сессия',                          rarity: 'rare',      xp: 50,  check: (s) => s.silentStudySessions >= 1 },
  { id: 'm26', icon: '🚜', name: 'Трактор едет на ДНС',       title: 'Час радости', desc: '5 ДЗ выполнено',                        rarity: 'rare',      xp: 120, check: (s) => s.hwDone >= 5 },
  { id: 'm27', icon: '🐯', name: 'Поганец',                   title: 'Поганец',     desc: 'Схитрить',                              rarity: 'common',    xp: 25,  check: (s) => s.cheatedTasks >= 1 },
  { id: 'm28', icon: '🐱', name: 'Муся, это ты?',             title: 'Муся',        desc: 'Вернуться через 3+ дня',                rarity: 'common',    xp: 20,  check: (s) => s.comeBackAfter3Days >= 1 },
  { id: 'm29', icon: '🐝', name: 'Шмель в башне',             title: 'Шмель',       desc: 'Помодоро в необычном месте',            rarity: 'rare',      xp: 40,  check: (s) => s.pomodoroUnusualPlace >= 1 },
  { id: 'm30', icon: '💨', name: 'Воздухан',                  title: 'Воздухан',    desc: 'Отложенное на неделю',                  rarity: 'rare',      xp: 70,  check: (s) => s.longOverdueDone >= 1 },
  { id: 'm31', icon: '🐈', name: 'Котость',                   title: 'Котость',     desc: '3 голосовых за день',                   rarity: 'rare',      xp: 40,  check: (s) => s.voiceInputsToday >= 3 },
  { id: 'm32', icon: '📛', name: 'Данил Колбасенко',          title: 'Колбасенко',  desc: '10 активностей за день',                rarity: 'rare',      xp: 120, check: (s) => (s.activeDays[s.today] || 0) >= 10 },
  { id: 'm33', icon: '🌀', name: 'Бурмалда',                  title: 'Бурмалда',    desc: '5 длинных задач',                       rarity: 'rare',      xp: 40,  check: (s) => s.checklist.filter((t) => t.text.length > 25).length >= 5 },
  { id: 'm34', icon: '📼', name: 'Верните мой 2016-й',        title: '2016',        desc: 'Пересмотреть старые карточки',          rarity: 'common',    xp: 30,  check: (s) => s.reviewedOldCards >= 1 },
  { id: 'm35', icon: '📹', name: 'Я фиксирую',                title: 'Фиксирую',    desc: 'Зафиксировать момент',                  rarity: 'common',    xp: 30,  check: (s) => s.absurdMoments >= 1 },
  { id: 'm36', icon: '💪', name: 'Я тебя могну',              title: 'Могну',       desc: 'Побить свой рекорд',                    rarity: 'rare',      xp: 45,  check: (s) => s.beatOwnRecord >= 1 },
  { id: 'm37', icon: '🔥', name: 'Мокну в камине в 6 утра',   title: 'Камин 6:00',  desc: 'Открыть до 7 утра',                     rarity: 'rare',      xp: 40,  check: () => new Date().getHours() < 7 },
  { id: 'm38', icon: '⚡', name: 'Электрощиток',              title: 'Электрощиток',desc: 'Музыка во время учёбы',                 rarity: 'common',    xp: 35,  check: (s) => s.musicDuringStudy >= 1 },
  { id: 'm39', icon: '🐆', name: 'Everybody, танцуй пантера', title: 'Пантера',     desc: '5 танцевальных перерывов',              rarity: 'common',    xp: 35,  check: (s) => s.danceBreaks >= 5 },
  { id: 'm40', icon: '📓', name: 'Тетрадки в клеточку',       title: 'Тетрадки',    desc: 'Заполнить все поля ДЗ',                 rarity: 'common',    xp: 25,  check: (s) => s.homework.some((h) => h.grade && h.priority) },
  { id: 'm41', icon: '2️⃣', name: 'Верите, математика два',  title: 'Двойка',      desc: '5 двоек',                               rarity: 'rare',      xp: 50,  check: (s) => s.homework.filter((h) => h.grade === 2).length >= 5 },
  { id: 'm42', icon: '🇷🇺', name: 'Песня Шамана',             title: 'Шаман',       desc: '3 раза спеть в чате',                   rarity: 'rare',      xp: 60,  check: (s) => s.shamanSung >= 3 }
]