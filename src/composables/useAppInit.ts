// src/composables/useAppInit.ts
// Загрузка / сохранение состояния приложения в localStorage.

import { watch } from 'vue'
import {
  useUserStore,
  useHomeworkStore,
  useChecklistStore,
  useUiStore
} from '@/stores'
import { useShopStore } from '@/stores/shop'
import { usePetStore } from '@/stores/pet'
import { useScheduleStore } from '@/stores/schedule'
import { useAvatarStore } from '@/stores/avatar'
import { loadFromStorage, saveToStorage, clearStorage } from '@/utils/storage'
import { useFlashStore } from '@/stores/flash'
import { useFridgeStore } from '@/stores/fridge'
import { useAchievementsStore } from '@/stores/achievements'
import { useProgressStore } from '@/stores/progress'
import { useChatStore } from '@/stores/chat'
import { useChestStore } from '@/stores/chest'
import { useBackgroundStore } from '@/stores/background'

export function useAppInit() {
  const user = useUserStore()
  const homework = useHomeworkStore()
  const checklist = useChecklistStore()
  const ui = useUiStore()
  const shop = useShopStore()
  const pet = usePetStore()
  const schedule = useScheduleStore()
  const avatar = useAvatarStore()
  const flash = useFlashStore()
  const fridge = useFridgeStore()
  const progress = useProgressStore()
  const chest = useChestStore()
  const bg = useBackgroundStore()
  const chat = useChatStore()

  function snapshot() {
    return {
      user: {
        onboarded: user.onboarded,
        name: user.name,
        grade: user.grade,
        id: user.id,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        lastCompletedDate: user.lastCompletedDate,
        activeTitle: user.activeTitle,
        premium: user.premium,
        activeDays: user.activeDays,
        achievements: user.achievements,
        memeAchievements: user.memeAchievements,
        viewedTopics: user.viewedTopics,
        solvedProblems: user.solvedProblems,
        pomodoroCount: user.pomodoroCount,
        completedFlashCards: user.completedFlashCards,
        usedVoiceInput: user.usedVoiceInput,
        statsViewsToday: user.statsViewsToday,
        shamanSung: user.shamanSung,
        errorStreak: user.errorStreak,
        errorDiary: user.errorDiary,
      },
      homework: { items: homework.items },
      checklist: { items: checklist.items },
      ui: {
        theme: ui.theme,
        fontSize: ui.fontSize,
        customThemeColor: ui.customThemeColor,
        notifications: ui.notifications,
        sounds: ui.sounds,
        vibration: ui.vibration,
        schoolStart: ui.schoolStart,
        schoolEnd: ui.schoolEnd,
        vacationStart: ui.vacationStart,
        vacationEnd: ui.vacationEnd
      },
      shop: {
        activeColor: shop.activeColor,
        activeHat: shop.activeHat,
        activeTheme: shop.activeTheme,
        activeBackground: shop.activeBackground,
        ownedColors: shop.ownedColors,
        ownedHats: shop.ownedHats,
        ownedThemes: shop.ownedThemes,
        ownedBackgrounds: shop.ownedBackgrounds
      },
      pet: {
        pet: pet.pet,
        feedsToday: pet.feedsToday,
        playsToday: pet.playsToday,
        petsToday: pet.petsToday
      },
      schedule: {
        schedule: schedule.schedule,
        afterSchool: schedule.afterSchool
      },
      avatar: {
        active: avatar.active,
        owned: avatar.owned
      },
      flash: {
        cards: flash.cards,
        activeDeck: flash.activeDeck
      },
      fridge: {
        items: fridge.items
      },
      progress: {
        schoolStart: progress.schoolStart,
        schoolEnd: progress.schoolEnd,
        vacationStart: progress.vacationStart,
        vacationEnd: progress.vacationEnd
      },
      chest: {
        openedDate: chest.openedDate
      },
      chat: {
        messages: chat.messages,
        usageDate: chat.usageDate,
        usageCount: chat.usageCount
      },
    }
  }

  function hydrate(saved: ReturnType<typeof snapshot>) {
    if (!saved) return

    if (saved.user) Object.assign(user, saved.user)
    if (saved.homework) homework.items = saved.homework.items || []
    if (saved.checklist) checklist.items = saved.checklist.items || []
    if (saved.ui) Object.assign(ui, saved.ui)
    if (saved.shop) Object.assign(shop, saved.shop)
    if (saved.progress) Object.assign(progress, saved.progress)
    if (saved.chest) Object.assign(chest, saved.chest)
    if (saved.shop) Object.assign(shop, saved.shop)
    if (saved.shop?.activeBackground) bg.setTheme(saved.shop.activeBackground)

    if (saved.pet) {
      if (saved.pet.pet) Object.assign(pet.pet, saved.pet.pet)
      if (saved.pet.feedsToday) Object.assign(pet.feedsToday, saved.pet.feedsToday)
      if (saved.pet.playsToday) Object.assign(pet.playsToday, saved.pet.playsToday)
      if (saved.pet.petsToday) Object.assign(pet.petsToday, saved.pet.petsToday)
    }

    if (saved.chat) {
      if (saved.chat.messages) chat.messages = saved.chat.messages
      if (saved.chat.usageDate) chat.usageDate = saved.chat.usageDate
      if (saved.chat.usageCount !== undefined) chat.usageCount = saved.chat.usageCount
    }

    if (saved.schedule) {
      if (saved.schedule.schedule) Object.assign(schedule.schedule, saved.schedule.schedule)
      if (saved.schedule.afterSchool) Object.assign(schedule.afterSchool, saved.schedule.afterSchool)
    }

    if (saved.avatar) {
      if (saved.avatar.active) Object.assign(avatar.active, saved.avatar.active)
      if (saved.avatar.owned) Object.assign(avatar.owned, saved.avatar.owned)
    }


    if (saved.flash) {
      if (saved.flash.cards) flash.cards = saved.flash.cards
      if (saved.flash.activeDeck) flash.activeDeck = saved.flash.activeDeck
    }
    if (saved.fridge) {
      if (saved.fridge.items) fridge.items = saved.fridge.items
    }
  }

  function load() {
    const fallback = snapshot()
    const saved = loadFromStorage(fallback)
    hydrate(saved)
    ui.applyTheme()
    ui.applyFontSize()
  }

  function startAutoSave() {
    watch(
      snapshot,
      (data) => saveToStorage(data),
      { deep: true, flush: 'post' }
    )
  }

  return { load, startAutoSave, clearStorage }
}