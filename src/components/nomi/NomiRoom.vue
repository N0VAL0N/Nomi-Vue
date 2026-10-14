<!-- src/components/nomi/NomiRoom.vue -->
<template>
  <div
    class="room"
    :class="{ compact }"
    @pointerdown="startDrag"
    @pointermove="onDrag"
    @pointerup="endDrag"
    @pointercancel="endDrag"
  >
    <!-- HUD поверх сцены -->
    <div v-if="showHud" class="room-hud">
      <div class="greeting">
        <div class="greeting-main">{{ greeting }}, {{ userName }}!</div>
        <div class="greeting-sub">{{ greetingSub }}</div>
      </div>
      <div class="clock">
        <div class="clock-time">{{ clock }}</div>
        <div class="clock-date">{{ clockDate }}</div>
      </div>
    </div>

    <!-- Куб -->
    <div class="cube-scene">
      <div
        class="cube"
        :style="{ transform: `rotateX(-15deg) rotateY(${rotationY}deg)` }"
      >
        <div class="cube-face face-front">
          <NomiAvatar :size="avatarSize" />
        </div>
        <div class="cube-face face-back">
          <NomiAvatar :size="avatarSize" />
        </div>
        <div class="cube-face face-left"><div class="face-pattern" /></div>
        <div class="cube-face face-right"><div class="face-pattern" /></div>
        <div class="cube-face face-top"><div class="face-pattern" /></div>
        <div class="cube-face face-bottom"><div class="face-pattern" /></div>
      </div>
    </div>

    <div v-if="showTip" class="room-tip">Крути пальцем</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import NomiAvatar from '@/components/nomi/NomiAvatar.vue'

const props = withDefaults(defineProps<{
  compact?: boolean       // меньшая высота для главной
  showHud?: boolean       // показывать приветствие/часы
  showTip?: boolean
  avatarSize?: number
}>(), {
  compact: false,
  showHud: true,
  showTip: false,
  avatarSize: 120
})

const user = useUserStore()

const rotationY = ref(-30)
let dragging = false
let lastX = 0
let autoRotateTimer: ReturnType<typeof setInterval> | null = null
let autoSpeed = 0.15

const clock = ref('--:--')
const clockDate = ref('—')

const userName = computed(() => user.name || 'друг')
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 5) return 'Доброй ночи'
  if (h < 12) return 'Доброе утро'
  if (h < 17) return 'Добрый день'
  if (h < 23) return 'Добрый вечер'
  return 'Доброй ночи'
})
const greetingSub = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Я рад тебя видеть'
  if (h < 18) return 'Как дела?'
  if (h < 23) return 'Готов учиться?'
  return 'Пора спать 😴'
})

function updateClock() {
  const d = new Date()
  clock.value = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
  const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  clockDate.value = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
}

function startDrag(e: PointerEvent) {
  dragging = true
  lastX = e.clientX
  autoSpeed = 0
  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
}

function onDrag(e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - lastX
  rotationY.value += dx * 0.5
  lastX = e.clientX
}

function endDrag() {
  dragging = false
  setTimeout(() => { autoSpeed = 0.15 }, 2000)
}

let clockTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 30000)
  autoRotateTimer = setInterval(() => {
    if (!dragging) rotationY.value += autoSpeed
  }, 30)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  if (autoRotateTimer) clearInterval(autoRotateTimer)
})
</script>

<style scoped>
.room {
  position: relative;
  height: 380px;
  border-radius: var(--radius-lg);
  background: radial-gradient(circle at 50% 40%, rgba(124, 58, 237, 0.25), rgba(10, 14, 26, 0.95));
  border: 1px solid var(--border-soft);
  overflow: hidden;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.room.compact { height: 280px; }

.room:active { cursor: grabbing; }

.room::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15), transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15), transparent 50%);
  pointer-events: none;
}

.room-hud {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
  pointer-events: none;
}

.greeting-main {
  font-weight: 800;
  font-size: 1rem;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
.greeting-sub {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}
.clock { text-align: right; }
.clock-time {
  font-size: 1.4rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1;
}
.clock-date {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}

.cube-scene {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  pointer-events: none;
}

.cube {
  width: 160px;
  height: 160px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.05s linear;
}

.cube-face {
  position: absolute;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(167, 139, 250, 0.5);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(99, 102, 241, 0.15));
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

.face-front  { transform: translateZ(80px); }
.face-back   { transform: rotateY(180deg) translateZ(80px); }
.face-left   { transform: rotateY(-90deg) translateZ(80px); }
.face-right  { transform: rotateY(90deg) translateZ(80px); }
.face-top    { transform: rotateX(90deg) translateZ(80px); }
.face-bottom { transform: rotateX(-90deg) translateZ(80px); }

.face-pattern {
  width: 60%;
  height: 60%;
  border-radius: 12px;
  background:
    radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.5), transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.3), transparent 60%);
}

.room-tip {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  z-index: 2;
  pointer-events: none;
  font-weight: 600;
  letter-spacing: 0.03em;
}
</style>