<!-- src/views/ShopView.vue -->
<template>
  <div class="shop-view">
    <div class="title">🛒 Магазин</div>

    <div class="balance glass">
      <AppIcon name="star" :size="18" />
      <span class="balance-value">{{ user.xp }}</span>
      <span class="balance-label">XP</span>
    </div>

    <!-- Табы -->
    <div class="tabs">
      <button
        v-for="t in tabs"
        :key="t.value"
        class="tab"
        :class="{ active: activeTab === t.value }"
        @click="activeTab = t.value"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Цвета -->
    <div v-if="activeTab === 'colors'" class="grid">
      <div
        v-for="c in AVATAR_COLORS"
        :key="c.id"
        class="item"
        :class="{
          owned: shop.ownedColors.includes(c.id),
          active: shop.activeColor === c.id
        }"
        @click="pickColor(c)"
      >
        <div class="preview-avatar">
          <NomiAvatar :size="72" :preview-color="c.id" />
        </div>
        <div class="item-name">{{ c.name }}</div>
        <div class="item-price" :class="{ owned: shop.ownedColors.includes(c.id) }">
          {{ priceLabel(c, shop.ownedColors) }}
        </div>
      </div>
    </div>

    <!-- Шляпы -->
    <div v-if="activeTab === 'hats'" class="grid">
      <div
        v-for="h in HATS"
        :key="h.id"
        class="item"
        :class="{
          owned: shop.ownedHats.includes(h.id),
          active: shop.activeHat === h.id
        }"
        @click="pickHat(h)"
      >
        <div class="hat-preview">{{ h.icon }}</div>
        <div class="item-name">{{ h.name }}</div>
        <div class="item-price" :class="{ owned: shop.ownedHats.includes(h.id) }">
          {{ priceLabel(h, shop.ownedHats) }}
        </div>
      </div>
    </div>

    <!-- Внешность Номи -->
    <div v-if="activeTab === 'look'" class="look-panel">
      <div class="look-tabs">
        <button
          v-for="t in lookTabs"
          :key="t.value"
          class="look-tab"
          :class="{ active: lookTab === t.value }"
          @click="lookTab = t.value"
        >
          {{ t.label }}
        </button>
      </div>

      <div class="grid">
        <div
          v-for="item in currentLookItems"
          :key="item.id"
          class="item"
          :class="{
            owned: avatar.isOwned(lookTab, item.id),
            active: avatar.active[lookTab] === item.id
          }"
          @click="pickLook(item.id)"
        >
          <div class="preview-avatar">
            <NomiAvatar
              :size="72"
              :preview-tab="lookTab"
              :preview-id="item.id"
            />
          </div>
          <div class="item-name">{{ item.name }}</div>
          <div class="item-price" :class="{ owned: avatar.isOwned(lookTab, item.id) }">
            {{ priceLabel(item, avatar.owned[lookTab]) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Темы -->
    <div v-if="activeTab === 'themes'" class="grid">
      <div
        v-for="t in [...THEMES_BASE, ...THEMES_EXTRA]"
        :key="t.id"
        class="item"
        :class="{
          owned: shop.ownedThemes.includes(t.id),
          active: shop.activeTheme === t.id
        }"
        @click="pickTheme(t)"
      >
        <div
          class="theme-preview"
          :style="{ background: t.gradient || (t.id === 'light' ? '#FFFFFF' : '#0A0E1A') }"
        />
        <div class="item-name">{{ t.name }}</div>
        <div class="item-price" :class="{ owned: shop.ownedThemes.includes(t.id) }">
          {{ priceLabel(t, shop.ownedThemes) }}
        </div>
      </div>
    </div>

    <!-- Фоны -->
    <div v-if="activeTab === 'backgrounds'" class="grid">
      <div
        v-for="b in BACKGROUNDS"
        :key="b.id"
        class="item"
        :class="{
          owned: shop.ownedBackgrounds.includes(b.id),
          active: shop.activeBackground === b.id
        }"
        @click="pickBackground(b)"
      >
        <div class="bg-preview" :style="{ background: b.css || 'var(--card-bg-2)' }" />
        <div class="item-name">{{ b.name }}</div>
        <div class="item-price" :class="{ owned: shop.ownedBackgrounds.includes(b.id) }">
          {{ priceLabel(b, shop.ownedBackgrounds as string[]) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useShopStore, AVATAR_COLORS, HATS, THEMES_BASE, THEMES_EXTRA, BACKGROUNDS, type ShopItem, type BackgroundItem } from '@/stores/shop'
import { useAvatarStore, type LookTab } from '@/stores/avatar'
import { useBackgroundStore } from '@/stores/background'
import { NOMI_LOOK_DATA, type AvatarItem } from '@/data/avatar'
import { useEconomy } from '@/composables/useEconomy'
import { useToast } from '@/composables/useToast'
import { useSound } from '@/composables/useSound'
import { vRipple } from '@/directives/ripple'
import AppIcon from '@/components/ui/AppIcon.vue'
import NomiAvatar from '@/components/nomi/NomiAvatar.vue'

const user = useUserStore()
const shop = useShopStore()
const avatar = useAvatarStore()
const bg = useBackgroundStore()
const economy = useEconomy()
const toast = useToast()
const sound = useSound()

const activeTab = ref('colors')
const lookTab = ref<LookTab>('horns')

const tabs = [
  { value: 'colors', label: '🎭 Цвета' },
  { value: 'hats', label: '🎩 Шляпы' },
  { value: 'look', label: '😈 Внешность' },
  { value: 'themes', label: '🎨 Темы' },
  { value: 'backgrounds', label: '🖼 Фоны' }
]

const lookTabs = [
  { value: 'horns' as LookTab,  label: '😈 Рожки' },
  { value: 'eyes' as LookTab,   label: '👁️ Глазки' },
  { value: 'noses' as LookTab,  label: '👃 Носики' },
  { value: 'mouths' as LookTab, label: '😊 Улыбки' }
]

const currentLookItems = computed<AvatarItem[]>(() => NOMI_LOOK_DATA[lookTab.value] || [])

function priceLabel(item: ShopItem | AvatarItem | BackgroundItem, owned: string[]): string {
  if (owned.includes(item.id)) return 'Есть'
  if (item.price === 0) return 'Бесплатно'
  const realPrice = user.isPremium ? Math.round(item.price * 0.7) : item.price
  return realPrice + ' XP'
}

function tryBuy(item: ShopItem | AvatarItem | BackgroundItem, owned: string[]): boolean {
  if (owned.includes(item.id)) return true
  if (user.isPremium) {
    toast.gold('💎 Бесплатно!')
    return true
  }
  const realPrice = Math.round(item.price * 0.7)
  if (realPrice === 0) return true
  if (!confirm(`Купить «${item.name}» за ${realPrice} XP?`)) return false
  if (!economy.spendXP(realPrice)) return false
  sound.success()
  return true
}

function pickColor(c: ShopItem) {
  if (!tryBuy(c, shop.ownedColors)) return
  shop.ownColor(c.id)
  toast.success(`🎭 ${c.name}`)
}

function pickHat(h: ShopItem) {
  if (h.premium && !user.isPremium) {
    toast.warning('💎 Только Premium')
    return
  }
  if (!tryBuy(h, shop.ownedHats)) return
  shop.ownHat(h.id)
  toast.success(`🎩 ${h.name}`)
}

function pickLook(id: string) {
  const item = currentLookItems.value.find((x) => x.id === id)
  if (!item) return
  const ownedList = avatar.owned[lookTab.value]
  if (!ownedList.includes(id)) {
    if (!tryBuy(item, ownedList)) return
    avatar.own(lookTab.value, id)
  }
  avatar.setActive(lookTab.value, id)
  toast.success(`🎉 ${item.name}`)
}

function pickTheme(t: ShopItem) {
  if (!tryBuy(t, shop.ownedThemes)) return
  shop.ownTheme(t.id)
  applyThemeClass(t.id)
  toast.success(`🎨 ${t.name}`)
}

function pickBackground(b: BackgroundItem) {
  if (!tryBuy(b, shop.ownedBackgrounds as string[])) return
  shop.ownBackground(b.id)
  bg.setTheme(b.id)
  toast.success(`🖼 ${b.name}`)
}

function applyThemeClass(id: string) {
  document.body.classList.remove('theme-fire', 'theme-forest', 'theme-gold', 'theme-cosmic', 'light-theme')
  if (id === 'light') document.body.classList.add('light-theme')
  else if (id !== 'dark') document.body.classList.add('theme-' + id)
}

// Применяем сохранённую тему при загрузке
watch(() => shop.activeTheme, applyThemeClass, { immediate: true })
</script>

<style scoped>
.shop-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 14px;
}

.balance {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--radius-full);
  background: var(--grad-gold) !important;
  color: #0A1930;
  font-weight: 800;
  font-size: 0.95rem;
  margin-bottom: 14px;
}

.balance :deep(svg) { color: #0A1930; }

.balance-value { font-size: 1.2rem; }
.balance-label { margin-left: auto; opacity: 0.7; font-size: 0.75rem; }

.tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 14px;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar { display: none; }

.tab {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--card-bg-2);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
}

.tab.active {
  background: var(--grad-purple);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.5);
  transform: scale(1.05);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (min-width: 700px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}

.item {
  padding: 14px;
  border-radius: var(--radius);
  background: var(--grad-card);
  border: 1.5px solid var(--border-soft);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.item:active { transform: scale(0.97); }
.item.owned { border-color: var(--success); }
.item.active { box-shadow: 0 0 0 2px var(--success); }

.preview-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  height: 72px;
}

.hat-preview {
  font-size: 2.5rem;
  margin-bottom: 8px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-preview {
  height: 72px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid var(--border);
}

.bg-preview {
  height: 72px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid var(--border);
}

.item-name {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text);
  margin-bottom: 6px;
}

.item-price {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--card-bg-2);
  border: 1px solid var(--border);
  font-size: 0.72rem;
  font-weight: 800;
  color: #A78BFA;
}

.item-price.owned {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
  border: none;
}

.look-panel { margin-top: 4px; }

.look-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 14px;
  scrollbar-width: none;
}

.look-tabs::-webkit-scrollbar { display: none; }

.look-tab {
  flex-shrink: 0;
  padding: 9px 16px;
  border-radius: var(--radius-full);
  background: var(--card-bg-2);
  color: var(--text-secondary);
  border: 1.5px solid var(--border);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.look-tab.active {
  background: var(--grad-purple);
  color: #fff;
  border-color: transparent;
}
</style>