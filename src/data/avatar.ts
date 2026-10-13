// src/data/avatar.ts
// SVG-слои аватара Номи: рожки, глаза, носы, рты, цвета тела.

export interface AvatarItem {
  id: string
  name: string
  price: number
}

/* ---------- Рожки ---------- */

export const HORN_SHAPES: Record<string, string> = {
  classic: '<path d="M 16 17 Q 13 8 11 6 Q 15 9 19 14 Z" fill="currentColor"/>',
  sharp:   '<path d="M 14 16 L 9 3 L 20 12 Z" fill="currentColor"/>',
  ram:     '<path d="M 14 15 Q 6 12 8 4 Q 12 8 16 10 Q 20 12 18 16 Z" fill="currentColor"/>',
  deer:    '<path d="M 12 12 L 8 4 M 10 8 L 4 6 M 10 8 L 6 2" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  rainbow: '<path d="M 16 17 Q 13 8 11 6 Q 15 9 19 14 Z" fill="currentColor"/>',
  bull:    '<path d="M 14 16 Q 8 12 10 5 Q 13 9 17 11 Q 20 13 18 16 Z" fill="currentColor"/>',
  storm:   '<path d="M 14 16 L 10 6 L 14 9 L 11 3 L 18 12 L 15 11 L 19 16 Z" fill="currentColor"/>',
  fire:    '<path d="M 14 16 Q 10 10 13 4 Q 15 8 18 5 Q 20 10 18 15 Z" fill="currentColor"/>',
  crystal: '<path d="M 14 16 L 11 8 L 14 3 L 17 8 Z" fill="currentColor"/>',
  crown:   '<path d="M 12 14 L 10 6 L 14 10 L 16 4 L 18 10 L 22 6 L 20 14 Z" fill="currentColor"/>',
  moon:    '<path d="M 14 15 Q 8 12 12 5 Q 10 10 15 12 Q 18 13 14 15 Z" fill="currentColor"/>'
}

export const HORN_MIRROR: Record<string, string> = {
  classic: '<path d="M 44 17 Q 47 8 49 6 Q 45 9 41 14 Z" fill="currentColor"/>',
  sharp:   '<path d="M 46 16 L 51 3 L 40 12 Z" fill="currentColor"/>',
  ram:     '<path d="M 46 15 Q 54 12 52 4 Q 48 8 44 10 Q 40 12 42 16 Z" fill="currentColor"/>',
  deer:    '<path d="M 48 12 L 52 4 M 50 8 L 56 6 M 50 8 L 54 2" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  rainbow: '<path d="M 44 17 Q 47 8 49 6 Q 45 9 41 14 Z" fill="currentColor"/>',
  bull:    '<path d="M 46 16 Q 52 12 50 5 Q 47 9 43 11 Q 40 13 42 16 Z" fill="currentColor"/>',
  storm:   '<path d="M 46 16 L 50 6 L 46 9 L 49 3 L 42 12 L 45 11 L 41 16 Z" fill="currentColor"/>',
  fire:    '<path d="M 46 16 Q 50 10 47 4 Q 45 8 42 5 Q 40 10 42 15 Z" fill="currentColor"/>',
  crystal: '<path d="M 46 16 L 49 8 L 46 3 L 43 8 Z" fill="currentColor"/>',
  crown:   '<path d="M 48 14 L 50 6 L 46 10 L 44 4 L 42 10 L 38 6 L 40 14 Z" fill="currentColor"/>',
  moon:    '<path d="M 46 15 Q 52 12 48 5 Q 50 10 45 12 Q 42 13 46 15 Z" fill="currentColor"/>'
}

export const HORN_COLORS: Record<string, string> = {
  classic: '#7C3AED', sharp: '#1F2937', ram: '#A78BFA', deer: '#78350F',
  rainbow: '#EC4899', bull: '#4C1D95', storm: '#FBBF24', fire: '#F97316',
  crystal: '#93C5FD', crown: '#FCD34D', moon: '#E5E7EB'
}

/* ---------- Глаза ---------- */

export const EYE_SHAPES: Record<string, string> = {
  round:    '<circle cx="22" cy="28" r="2.4" fill="currentColor"/><circle cx="38" cy="28" r="2.4" fill="currentColor"/>',
  heart:    '<path d="M 22 25 Q 19 24 19 27 Q 19 30 22 32 Q 25 30 25 27 Q 25 24 22 25 Z" fill="currentColor"/><path d="M 38 25 Q 35 24 35 27 Q 35 30 38 32 Q 41 30 41 27 Q 41 24 38 25 Z" fill="currentColor"/>',
  star:     '<path d="M 22 24 L 23.5 27.5 L 27 28 L 24.5 30.5 L 25 34 L 22 32 L 19 34 L 19.5 30.5 L 17 28 L 20.5 27.5 Z" fill="currentColor"/>',
  flame:    '<path d="M 22 23 Q 18.5 27 20.5 30.5 Q 21.5 32.5 22 31 Q 22.5 32.5 23.5 30.5 Q 25.5 27 22 23 Z" fill="currentColor"/>',
  drop:     '<path d="M 22 24 Q 19 28 20 30.5 Q 21 32.5 22 32.5 Q 23 32.5 24 30.5 Q 25 28 22 24 Z" fill="currentColor"/>',
  crescent: '<path d="M 24.5 25 Q 19 26 19 28.5 Q 19 31 24.5 32 Q 21 29 24.5 25 Z" fill="currentColor"/><path d="M 40.5 25 Q 35 26 35 28.5 Q 35 31 40.5 32 Q 37 29 40.5 25 Z" fill="currentColor"/>',
  shy:      '<path d="M 20 29 Q 22 26 24 29" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M 36 29 Q 38 26 40 29" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  cry:      '<circle cx="22" cy="28" r="2.4" fill="currentColor"/><circle cx="38" cy="28" r="2.4" fill="currentColor"/><path d="M 22 30 L 22 34" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round"/><path d="M 38 30 L 38 34" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round"/>',
  sly:      '<path d="M 20 28 L 24 26 L 24 30 Z" fill="currentColor"/><path d="M 40 28 L 36 26 L 36 30 Z" fill="currentColor"/>',
  diamond:  '<path d="M 22 25 L 24 28 L 22 31 L 20 28 Z" fill="currentColor"/><path d="M 38 25 L 40 28 L 38 31 L 36 28 Z" fill="currentColor"/>',
  cosmic:   '<circle cx="22" cy="28" r="2.4" fill="#8B5CF6"/><circle cx="38" cy="28" r="2.4" fill="#8B5CF6"/><circle cx="23" cy="27" r="0.8" fill="#fff"/><circle cx="39" cy="27" r="0.8" fill="#fff"/>'
}

export const EYE_COLORS: Record<string, string> = {
  round: '#0A0E1A', heart: '#EC4899', star: '#FBBF24', flame: '#F97316',
  drop: '#60A5FA', crescent: '#E5E7EB', shy: '#A78BFA', cry: '#0A0E1A',
  sly: '#0A0E1A', diamond: '#93C5FD', cosmic: '#8B5CF6'
}

/* ---------- Носы ---------- */

export const NOSE_SHAPES: Record<string, string> = {
  small:    '<circle cx="30" cy="35" r="1.4" fill="#F9A8D4"/>',
  pig:      '<ellipse cx="30" cy="35" rx="2.2" ry="1.6" fill="#F9A8D4"/><circle cx="29" cy="35" r="0.4" fill="#0A0E1A"/><circle cx="31" cy="35" r="0.4" fill="#0A0E1A"/>',
  dog:      '<ellipse cx="30" cy="35" rx="1.8" ry="1.3" fill="#0A0E1A"/>',
  cat:      '<path d="M 28 35 L 30 33 L 32 35 L 30 36 Z" fill="#F9A8D4"/>',
  triangle: '<path d="M 30 33 L 32 36 L 28 36 Z" fill="#F9A8D4"/>',
  heart:    '<path d="M 30 34 Q 28 33 28 35 Q 28 37 30 38 Q 32 37 32 35 Q 32 33 30 34 Z" fill="#EC4899"/>',
  star:     '<path d="M 30 33 L 30.6 34.7 L 32.4 34.7 L 31 35.8 L 31.5 37.5 L 30 36.5 L 28.5 37.5 L 29 35.8 L 27.6 34.7 L 29.4 34.7 Z" fill="#FBBF24"/>',
  diamond:  '<path d="M 30 33 L 31.5 35 L 30 37 L 28.5 35 Z" fill="#93C5FD"/>',
  gold:     '<circle cx="30" cy="35" r="1.6" fill="#FCD34D"/><circle cx="29.5" cy="34.5" r="0.5" fill="#fff"/>',
  comet:    '<circle cx="30" cy="35" r="1.4" fill="#F97316"/><path d="M 28 34 L 25 33" stroke="#F97316" stroke-width="0.8"/>',
  magic:    '<circle cx="30" cy="35" r="1.6" fill="#8B5CF6"/><circle cx="30" cy="35" r="0.5" fill="#FBBF24"/>'
}

/* ---------- Рты ---------- */

export const SMALL_MOUTHS: Record<string, string> = {
  soft:   'M 23 42 Q 30 47 37 42',
  wide:   'M 20 42 Q 30 51 40 42',
  happy:  'M 20 42 Q 30 53 40 42',
  lick:   'M 23 42 Q 30 47 37 42 M 30 46 L 30 51',
  sly:    'M 23 44 Q 30 44 37 41',
  demon:  'M 20 42 Q 30 51 40 42 L 24 46 L 27 50',
  cat:    'M 23 42 Q 26 45 30 42 Q 34 45 37 42',
  purr:   'M 25 44 Q 30 47 35 44',
  wow:    'M 27 43 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0',
  love:   'M 23 42 Q 30 49 37 42 M 30 40 L 30 43',
  fang:   'M 20 42 Q 30 51 40 42 L 24 46 L 27 49 L 30 49 L 33 49 L 36 46'
}

/* ---------- Цвета тела ---------- */

export const NOMI_BODY_COLORS: Record<string, [string, string]> = {
  default: ['#4C6FFF', '#8B5CF6'],
  purple:  ['#8B5CF6', '#7C3AED'],
  green:   ['#22C55E', '#16A34A'],
  pink:    ['#EC4899', '#F472B6'],
  gold:    ['#FBBF24', '#F59E0B'],
  red:     ['#EF4444', '#DC2626'],
  ice:     ['#06B6D4', '#3B82F6'],
  fire:    ['#F97316', '#DC2626']
}

/* ---------- Каталог для магазина ---------- */

export const NOMI_LOOK_DATA: Record<string, AvatarItem[]> = {
  horns: [
    { id: 'classic', name: 'Классические', price: 0 },
    { id: 'sharp',   name: 'Злые острые',  price: 80 },
    { id: 'ram',     name: 'Бараньи',      price: 120 },
    { id: 'deer',    name: 'Оленьи',       price: 140 },
    { id: 'rainbow', name: 'Радужные',     price: 150 },
    { id: 'bull',    name: 'Бычьи',        price: 160 },
    { id: 'storm',   name: 'Грозовые',     price: 240 },
    { id: 'fire',    name: 'Огненные',     price: 300 },
    { id: 'crystal', name: 'Кристальные',  price: 380 },
    { id: 'crown',   name: 'Королевские',  price: 460 },
    { id: 'moon',    name: 'Лунные',       price: 550 }
  ],
  eyes: [
    { id: 'round',    name: 'Обычные',     price: 0 },
    { id: 'heart',    name: 'Сердечки',    price: 60 },
    { id: 'star',     name: 'Звёздочки',   price: 100 },
    { id: 'flame',    name: 'Пламя',       price: 140 },
    { id: 'drop',     name: 'Капельки',    price: 160 },
    { id: 'crescent', name: 'Полумесяцы',  price: 180 },
    { id: 'shy',      name: 'Смущённые',   price: 200 },
    { id: 'cry',      name: 'Слезливые',   price: 220 },
    { id: 'sly',      name: 'Хитрые',      price: 260 },
    { id: 'diamond',  name: 'Алмазные',    price: 340 },
    { id: 'cosmic',   name: 'Космические', price: 500 }
  ],
  noses: [
    { id: 'small',    name: 'Обычный',     price: 0 },
    { id: 'pig',      name: 'Пятачок',     price: 50 },
    { id: 'dog',      name: 'Собачий',     price: 60 },
    { id: 'cat',      name: 'Кошачий',     price: 70 },
    { id: 'triangle', name: 'Треугольный', price: 90 },
    { id: 'heart',    name: 'Сердечко',    price: 100 },
    { id: 'star',     name: 'Звёздочка',   price: 130 },
    { id: 'diamond',  name: 'Ромб',        price: 150 },
    { id: 'gold',     name: 'Золотой',     price: 280 },
    { id: 'comet',    name: 'Комета',      price: 360 },
    { id: 'magic',    name: 'Магический',  price: 480 }
  ],
  mouths: [
    { id: 'soft',   name: 'Добрая',       price: 0 },
    { id: 'wide',   name: 'Широкая',      price: 40 },
    { id: 'happy',  name: 'Счастливая',   price: 60 },
    { id: 'lick',   name: 'Облизывается', price: 90 },
    { id: 'cat',    name: 'Кошачья',      price: 110 },
    { id: 'sly',    name: 'Хитрая',       price: 120 },
    { id: 'purr',   name: 'Мурчащая',     price: 140 },
    { id: 'wow',    name: 'Восторг',      price: 170 },
    { id: 'demon',  name: 'Демонская',    price: 200 },
    { id: 'love',   name: 'Влюблённая',   price: 220 },
    { id: 'fang',   name: 'Клыкастая',    price: 320 }
  ]
}