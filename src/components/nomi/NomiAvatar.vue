<!-- src/components/nomi/NomiAvatar.vue -->
<template>
  <div class="nomi-avatar" :class="emotionClass">
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient :id="gradId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="bodyColors[0]" />
          <stop offset="100%" :stop-color="bodyColors[1]" />
        </linearGradient>
      </defs>

      <!-- Рожки -->
      <g v-html="hornsSvg" />
      <!-- Тело -->
      <ellipse cx="30" cy="32" rx="22" ry="20" :fill="`url(#${gradId})`" />
      <!-- Белки глаз -->
      <ellipse cx="22" cy="28" rx="4.5" ry="5" fill="#fff" />
      <ellipse cx="38" cy="28" rx="4.5" ry="5" fill="#fff" />
      <!-- Зрачки -->
      <g v-html="eyesSvg" />
      <!-- Нос -->
      <g v-html="noseSvg" />
      <!-- Рот -->
      <path :d="mouthPath" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAvatarStore } from '@/stores/avatar'
import { useShopStore } from '@/stores/shop'
import {
  HORN_SHAPES, HORN_MIRROR, HORN_COLORS,
  EYE_SHAPES, EYE_COLORS, NOSE_SHAPES, SMALL_MOUTHS,
  NOMI_BODY_COLORS
} from '@/data/avatar'

const props = withDefaults(defineProps<{
  size?: number
}>(), { size: 52 })

const avatar = useAvatarStore()
const shop = useShopStore()

const gradId = `nomiGrad-${Math.random().toString(36).slice(2, 8)}`

const bodyColors = computed(() => {
  return NOMI_BODY_COLORS[shop.activeColor] || NOMI_BODY_COLORS.purple
})

const hornsSvg = computed(() => {
  const id = avatar.active.horns
  const shape = HORN_SHAPES[id] || HORN_SHAPES.classic
  const mirror = HORN_MIRROR[id] || HORN_MIRROR.classic
  const color = HORN_COLORS[id] || HORN_COLORS.classic
  return (shape + mirror).replace(/currentColor/g, color)
})

const eyesSvg = computed(() => {
  const id = avatar.active.eyes
  const shape = EYE_SHAPES[id] || EYE_SHAPES.round
  const color = EYE_COLORS[id] || EYE_COLORS.round
  return shape.replace(/currentColor/g, color)
})

const noseSvg = computed(() => NOSE_SHAPES[avatar.active.noses] || NOSE_SHAPES.small)

const mouthPath = computed(() => {
  // При эмоциях подменяем рот
  const emotionToMouth: Record<string, string> = {
    excited: 'wide',
    love: 'love',
    eating: 'lick',
    angry: 'fang',
    sleepy: 'purr'
  }
  const mouthId = avatar.emotion === 'happy'
    ? avatar.active.mouths
    : (emotionToMouth[avatar.emotion] || avatar.active.mouths)
  return SMALL_MOUTHS[mouthId] || SMALL_MOUTHS.soft
})

const emotionClass = computed(() => `emoji-${avatar.emotion}`)
</script>

<style scoped>
.nomi-avatar {
  width: v-bind('props.size + "px"');
  height: v-bind('props.size + "px"');
  display: inline-block;
  position: relative;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.5));
  transition: transform 0.2s;
}

.nomi-avatar svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

.emoji-happy   { animation: bounce 3s ease-in-out infinite; }
.emoji-excited { animation: shake 0.8s ease-in-out infinite; }
.emoji-love    { animation: pulse 1s ease-in-out; }
.emoji-eating  { animation: chew 0.6s ease-in-out infinite; }
.emoji-angry   { animation: shake 0.5s ease-in-out; }
.emoji-sleepy  { animation: pulse 4s ease-in-out infinite; opacity: 0.75; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
@keyframes shake {
  0%, 100% { transform: scale(1) rotate(0); }
  20%      { transform: scale(1.15) rotate(-8deg); }
  40%      { transform: scale(1.15) rotate(8deg); }
  60%      { transform: scale(1.1) rotate(-5deg); }
  80%      { transform: scale(1.1) rotate(5deg); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.15); }
}
@keyframes chew {
  0%, 100% { transform: scale(1); }
  25%      { transform: scale(1.08) rotate(-2deg); }
  75%      { transform: scale(1.08) rotate(2deg); }
}
</style>