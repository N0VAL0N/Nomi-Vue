// src/stores/shop.ts
import { defineStore } from 'pinia'
import type { BgTheme } from './background'

export interface ShopItem {
  id: string
  name: string
  price: number
  icon?: string
  gradient?: string
  css?: string
  bodyClass?: string
  premium?: boolean
}

/* ---------- Темы ---------- */

export const THEMES_BASE: ShopItem[] = [
  { id: 'dark',  name: 'Тёмная',  price: 0 },
  { id: 'light', name: 'Светлая', price: 0 }
]

export const THEMES_EXTRA: ShopItem[] = [
  { id: 'fire',   name: 'Огонь',  price: 180, gradient: 'linear-gradient(135deg,#EF4444,#F97316)' },
  { id: 'forest', name: 'Лес',    price: 220, gradient: 'linear-gradient(135deg,#22C55E,#166534)' },
  { id: 'gold',   name: 'Золото', price: 420, gradient: 'linear-gradient(135deg,#FBBF24,#F59E0B)' },
  { id: 'cosmic', name: 'Космос', price: 650, gradient: 'linear-gradient(135deg,#8B5CF6,#EC4899)' }
]

/* ---------- Цвета аватара ---------- */

export const AVATAR_COLORS: ShopItem[] = [
  { id: 'default', name: 'Синий',       price: 0,   gradient: 'linear-gradient(135deg,#4C6FFF,#6B5FFF)' },
  { id: 'purple',  name: 'Фиолетовый',  price: 0,   gradient: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' },
  { id: 'green',   name: 'Зелёный',     price: 120, gradient: 'linear-gradient(135deg,#22C55E,#16A34A)' },
  { id: 'pink',    name: 'Розовый',     price: 210, gradient: 'linear-gradient(135deg,#EC4899,#F472B6)' },
  { id: 'gold',    name: 'Золотой',     price: 260, gradient: 'linear-gradient(135deg,#FBBF24,#F59E0B)' },
  { id: 'red',     name: 'Красный',     price: 300, gradient: 'linear-gradient(135deg,#EF4444,#DC2626)' },
  { id: 'ice',     name: 'Ледяной',     price: 380, gradient: 'linear-gradient(135deg,#06B6D4,#3B82F6)' },
  { id: 'fire',    name: 'Огненный',    price: 450, gradient: 'linear-gradient(135deg,#F97316,#DC2626)' }
]

/* ---------- Шляпы ---------- */

export const HATS: ShopItem[] = [
  { id: 'none',  name: 'Без шляпы',   price: 0,   icon: '—' },
  { id: 'cap',   name: 'Кепка',       price: 90,  icon: '🧢' },
  { id: 'party', name: 'Праздничная', price: 180, icon: '🎉' },
  { id: 'grad',  name: 'Выпускник',   price: 320, icon: '🎓' },
  { id: 'santa', name: 'Новогодняя',  price: 400, icon: '🎅' },
  { id: 'tiara', name: 'Диадема',     price: 700, icon: '💎', premium: true }
]

/* ---------- Фоны ---------- */

export interface BackgroundItem {
  id: BgTheme
  name: string
  price: number
  css: string
}

export const BACKGROUNDS: BackgroundItem[] = [
  { id: 'default', name: 'Без фона',      price: 0,   css: '' },
  { id: 'forest',  name: 'Лес',           price: 250, css: 'linear-gradient(180deg,#22C55E,#166534)' },
  { id: 'stars',   name: 'Звёздное небо', price: 320, css: 'radial-gradient(circle at 30% 20%, #4C6FFF, #1E1B4B, #05040F)' },
  { id: 'sunset',  name: 'Закат',         price: 400, css: 'linear-gradient(180deg,#FBBF24,#EC4899,#7C3AED)' },
  { id: 'ocean',   name: 'Океан',         price: 480, css: 'linear-gradient(180deg,#38BDF8,#0EA5E9,#0369A1)' }
]

/* ---------- Стор ---------- */

export const useShopStore = defineStore('shop', {
  state: () => ({
    // Активные
    activeColor: 'purple',
    activeHat: 'none',
    activeTheme: 'dark',
    activeBackground: 'default' as BgTheme,

    // Купленные
    ownedColors: ['default', 'purple'] as string[],
    ownedHats: ['none'] as string[],
    ownedThemes: ['dark', 'light'] as string[],
    ownedBackgrounds: ['default'] as BgTheme[]
  }),

  actions: {
    ownColor(id: string) {
      if (!this.ownedColors.includes(id)) this.ownedColors.push(id)
      this.activeColor = id
    },
    ownHat(id: string) {
      if (!this.ownedHats.includes(id)) this.ownedHats.push(id)
      this.activeHat = id
    },
    ownTheme(id: string) {
      if (!this.ownedThemes.includes(id)) this.ownedThemes.push(id)
      this.activeTheme = id
    },
    ownBackground(id: BgTheme) {
      if (!this.ownedBackgrounds.includes(id)) this.ownedBackgrounds.push(id)
      this.activeBackground = id
    }
  }
})