<!-- src/views/ShopView.vue -->
<template>
  <div class="shop-view">
    <div class="title">🛒 Магазин</div>

    <div class="balance">
      <span class="balance-icon">💰</span>
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

    <!-- Цвета аватара -->
    <div v-if="activeTab === 'colors'" class="grid">
      <div
        v-for="c in colors"
        :key="c.id"
        class="item"
        :class="{ owned: shop.ownedColors.includes(c.id), active: shop.activeColor === c.id }"
        @click="pickColor(c)"
      >
        <div class="color-preview" :style="{ background: c.gradient }" />
        <div class="item-name">{{ c.name }}</div>
        <div class="item-price" :class="{ owned: shop.ownedColors.includes(c.id) }">
          {{ shop.ownedColors.includes(c.id) ? 'Есть' : (c.price === 0 ? 'Бесплатно' : c.price + ' XP') }}
        </div>
      </div>
    </div>

    <!-- Шляпы -->
    <div v-if="activeTab === 'hats'" class="grid">
      <div
        v-for="h in hats"
        :key="h.id"
        class="item"
        :class="{ owned: shop.ownedHats.includes(h.id), active: shop.activeHat === h.id }"
        @click="pickHat(h)"
      >
        <div class="hat-preview">{{ h.icon }}</div>
        <div class="item-name">{{ h.name }}</div>
        <div class="item-price" :class="{ owned: shop.ownedHats.includes(h.id) }">
          {{ shop.ownedHats.includes(h.id) ? 'Есть' : (h.price === 0 ? 'Бесплатно' : h.price + ' XP') }}
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
          <div class="look-preview">
            <NomiAvatar :size="80" />
          </div>
          <div class="item-name">{{ item.name }}</div>
          <div class="item-price" :class="{ owned: avatar.isOwned(lookTab, item.id) }">
            {{ avatar.isOwned(lookTab, item.id) ? 'Есть' : (item.price === 0 ? 'Бесплатно' : item.price + ' XP') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Заглушки -->
    <div v-if="activeTab === 'themes'" class="soon">🎨 Темы — скоро</div>
    <div v-if="activeTab === 'backgrounds'" class="soon">🖼 Фоны — скоро</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useShopStore, SHOP_AVATAR_COLORS, SHOP_HATS, type ShopItem } from '@/stores/shop'
import { useAvatarStore, type LookTab } from '@/stores/avatar'
import { NOMI_LOOK_DATA, type AvatarItem } from '@/data/avatar'
import { useEconomy } from '@/composables/useEconomy'
import { useToast } from '@/composables/useToast'
import { useSound } from '@/composables/useSound'
import NomiAvatar from '@/components/nomi/NomiAvatar.vue'

const user = useUserStore()
const shop = useShopStore()
const avatar = useAvatarStore()
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

const colors = SHOP_AVATAR_COLORS
const hats = SHOP_HATS

const currentLookItems = computed<AvatarItem[]>(() => NOMI_LOOK_DATA[lookTab.value] || [])

function tryBuy(item: ShopItem | AvatarItem, ownedList: string[]): boolean {
  if (ownedList.includes(item.id)) return true
  if (user.isPremium) {
    toast.gold('💎 Бесплатно!')
    return true
  }
  const finalPrice = user.price(item.price)
  if (finalPrice === 0) return true
  if (!confirm(`Купить «${item.name}» за ${finalPrice} XP?`)) return false
  if (!economy.spendXP(finalPrice)) return false
  sound.success()
  return true
}

function pickColor(c: ShopItem) {
  if (!tryBuy(c, shop.ownedColors)) return
  shop.buyColor(c)
  toast.success(`🎭 ${c.name}`)
}

function pickHat(h: ShopItem) {
  if (h.premium && !user.isPremium) {
    toast.warning('💎 Только Premium')
    return
  }
  if (!tryBuy(h, shop.ownedHats)) return
  shop.buyHat(h)
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
</script>

<style scoped>
.shop-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.title { font-size: 1.1rem; font-weight: 800; color: var(--text, #E6ECFF); margin-bottom: 14px; }

.balance {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  color: #0A1930;
  font-weight: 800;
  font-size: 0.95rem;
  margin-bottom: 14px;
}

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
  border-radius: 12px;
  background: var(--card-bg-2, #161E30);
  border: 1.5px solid var(--border, #1E2740);
  color: var(--text-secondary, #8B95B0);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.tab.active {
  background: linear-gradient(135deg, #7C3AED, #6366F1);
  color: #fff;
  border-color: transparent;
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
  border-radius: 16px;
  background: var(--card-bg, #131A2A);
  border: 1.5px solid var(--border-soft, #1A2236);
  text-align: center;
  cursor: pointer;
}

.item.owned { border-color: #22C55E; }
.item.active { box-shadow: 0 0 0 2px #22C55E; }

.color-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 8px;
}

.hat-preview {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.item-name {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text, #E6ECFF);
  margin-bottom: 6px;
}

.item-price {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 10px;
  background: var(--card-bg-2, #161E30);
  border: 1px solid var(--border, #1E2740);
  font-size: 0.75rem;
  font-weight: 800;
  color: #A78BFA;
}

.item-price.owned {
  background: rgba(34, 197, 94, 0.15);
  color: #22C55E;
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
  border-radius: 12px;
  background: var(--card-bg-2, #161E30);
  color: var(--text-secondary, #8B95B0);
  border: 1.5px solid var(--border, #1E2740);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.look-tab.active {
  background: linear-gradient(135deg, #7C3AED, #6366F1);
  color: #fff;
  border-color: transparent;
}

.look-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  height: 80px;
  align-items: center;
}

.soon {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim, #5A6478);
  font-size: 0.9rem;
}
</style>