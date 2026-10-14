<!-- src/components/ui/AppIcon.vue -->
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="app-icon"
  >
    <path v-for="(d, i) in paths" :key="i" :d="d" />
    <circle v-for="(c, i) in circles" :key="'c' + i" :cx="c.cx" :cy="c.cy" :r="c.r" />
    <polyline v-if="polyline" :points="polyline" />
    <line v-if="line" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" />
    <polygon v-if="polygon" :points="polygon" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    strokeWidth?: number
  }>(),
  {
    size: 20,
    strokeWidth: 2
  }
)

interface IconDef {
  paths?: string[]
  circles?: { cx: number; cy: number; r: number }[]
  polyline?: string
  line?: { x1: number; y1: number; x2: number; y2: number }
  polygon?: string
}

// Lucide-стиль. Только нужные иконки.
const ICONS: Record<string, IconDef> = {
  home: {
    paths: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
    polyline: '9 22 9 12 15 12 15 22'
  },
  book: {
    paths: [
      'M4 19.5A2.5 2.5 0 0 1 6.5 17H20',
      'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'
    ]
  },
  tools: {
    paths: [
      'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'
    ]
  },
  user: {
    paths: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'],
    circles: [{ cx: 12, cy: 7, r: 4 }]
  },
  settings: {
    circles: [{ cx: 12, cy: 12, r: 3 }],
    paths: [
      'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'
    ]
  },
  cart: {
    circles: [{ cx: 9, cy: 21, r: 1 }, { cx: 20, cy: 21, r: 1 }],
    paths: ['M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6']
  },
  plus: {
    line: { x1: 12, y1: 5, x2: 12, y2: 19 },
    paths: ['M5 12h14']
  },
  check: { polyline: '20 6 9 17 4 12' },
  flame: {
    paths: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z']
  },
  star: {
    polygon: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
  },
  clock: {
    circles: [{ cx: 12, cy: 12, r: 10 }],
    polyline: '12 6 12 12 16 14'
  },
  calendar: {
    paths: ['M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z', 'M16 2v4', 'M8 2v4', 'M3 10h18']
    },
  chart: {
    paths: ['M3 3v18h18', 'M18.7 8l-5.1 5.2-2.8-2.7L7 14.3']
  },
  message: {
    paths: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z']
  },
  back: {
    paths: ['M19 12H5', 'M12 19l-7-7 7-7']
  },
  close: {
    paths: ['M18 6L6 18', 'M6 6l12 12']
  },
  gift: {
    polyline: '20 12 20 22 4 22 4 12',
    paths: [
      'M2 7h20v5H2z',
      'M12 22V7',
      'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z',
      'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'
    ]
  },
  target: {
    circles: [{ cx: 12, cy: 12, r: 10 }, { cx: 12, cy: 12, r: 6 }, { cx: 12, cy: 12, r: 2 }]
  },
  sparkles: {
    paths: [
      'M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z',
      'M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z',
      'M5 14l.7 1.6L7.3 16l-1.6.7L5 18.3l-.7-1.6L2.7 16l1.6-.7z'
    ]
  },
  snowflake: {
    paths: [
      'M12 2v20',
      'M4.93 5.93l14.14 14.14',
      'M2 12h20',
      'M19.07 5.93L4.93 20.07'
    ]
  },
  card: {
    paths: [
      'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
      'M2 10h20'
    ]
  },
  list: {
    paths: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01']
  },
  brain: {
    paths: [
      'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z',
      'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z'
    ]
  }
}

const icon = computed<IconDef>(() => ICONS[props.name] || {})
const paths = computed(() => icon.value.paths || [])
const circles = computed(() => icon.value.circles || [])
const polyline = computed(() => icon.value.polyline || '')
const line = computed(() => icon.value.line)
const polygon = computed(() => icon.value.polygon || '')
</script>

<style scoped>
.app-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>