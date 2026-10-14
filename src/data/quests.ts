// src/data/quests.ts

export interface QuestDef {
  id: string
  icon: string
  name: string
  desc: string
  max: number
  xp: number
  get: (s: QuestStats) => number
}

export interface BossDef {
  id: string
  icon: string
  name: string
  desc: string
  max: number
  get: (s: QuestStats) => number
}

export interface SkillDef {
  id: string
  icon: string
  name: string
  desc: string
  max: number
  reward: string
  get: (s: QuestStats) => number
}

export interface QuestStats {
  hwDone: number
  pomodoro: number
  viewedTopics: number
  solvedProblems: number
  streak: number
  flashCompleted: number
}

export const QUESTS: QuestDef[] = [
  { id: 'hw5',    icon: '📚', name: 'Марафон ДЗ',      desc: '5 ДЗ',      max: 5,  xp: 50,   get: (s) => s.hwDone },
  { id: 'hw20',   icon: '🏅', name: 'Двадцатка',        desc: '20 ДЗ',     max: 20, xp: 200,  get: (s) => s.hwDone },
  { id: 'pomo10', icon: '🍅', name: 'Помидорный сад',   desc: '10 сессий', max: 10, xp: 100,  get: (s) => s.pomodoro },
  { id: 'pomo50', icon: '🔥', name: 'Помидорный лес',   desc: '50 сессий', max: 50, xp: 400,  get: (s) => s.pomodoro },
  { id: 'top10',  icon: '🔍', name: 'Исследователь',    desc: '10 тем',    max: 10, xp: 80,   get: (s) => s.viewedTopics },
  { id: 'sol25',  icon: '✏️', name: 'Решатель',         desc: '25 задач',  max: 25, xp: 150,  get: (s) => s.solvedProblems },
  { id: 'str7',   icon: '⚡', name: 'Неделя силы',      desc: 'Streak 7',  max: 7,  xp: 200,  get: (s) => s.streak },
  { id: 'str30',  icon: '💎', name: 'Месяц огня',       desc: 'Streak 30', max: 30, xp: 1000, get: (s) => s.streak }
]

export const BOSSES: BossDef[] = [
  { id: 'b1', icon: '👹', name: 'Босс: Лень',            desc: '10 ДЗ',     max: 10, get: (s) => s.hwDone },
  { id: 'b2', icon: '👻', name: 'Босс: Откладывание',    desc: '5 сессий',  max: 5,  get: (s) => s.pomodoro },
  { id: 'b3', icon: '🐙', name: 'Босс: Многозадачность', desc: '10 тем',    max: 10, get: (s) => s.viewedTopics },
  { id: 'b4', icon: '🦑', name: 'Босс: Забывчивость',    desc: 'Streak 14', max: 14, get: (s) => s.streak },
  { id: 'b5', icon: '🕷️', name: 'Босс: Хаос',            desc: '20 задач',  max: 20, get: (s) => s.solvedProblems },
  { id: 'b6', icon: '🐉', name: 'Дракон Экзаменов',      desc: 'Streak 30', max: 30, get: (s) => s.streak }
]

export const SKILLS: SkillDef[] = [
  { id: 's1', icon: '📚', name: 'Мастер ДЗ',        desc: '3 ДЗ',        max: 3,  reward: '+50 XP',  get: (s) => s.hwDone },
  { id: 's2', icon: '🍅', name: 'Помодоро-ниндзя',  desc: '5 сессий',    max: 5,  reward: '+80 XP',  get: (s) => s.pomodoro },
  { id: 's3', icon: '🔍', name: 'Исследователь',    desc: '5 тем',       max: 5,  reward: '+60 XP',  get: (s) => s.viewedTopics },
  { id: 's4', icon: '✏️', name: 'Решатель',         desc: '10 задач',    max: 10, reward: '+100 XP', get: (s) => s.solvedProblems },
  { id: 's5', icon: '🔥', name: 'Огонь',            desc: 'Streak 7',    max: 7,  reward: '+150 XP', get: (s) => s.streak },
  { id: 's6', icon: '🎴', name: 'Карточный мастер', desc: '10 карточек', max: 10, reward: '+100 XP', get: (s) => s.flashCompleted }
]