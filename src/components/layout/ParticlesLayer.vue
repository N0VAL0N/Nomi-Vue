<!-- src/components/layout/ParticlesLayer.vue -->
<template>
  <div class="particles-layer" :class="{ active: user.isPremium }">
    <svg
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :class="p.type"
      :style="{
        left: p.left + '%',
        animationDuration: p.duration + 's',
        animationDelay: p.delay + 's',
        width: p.size + 'px',
        height: p.size + 'px'
      }"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Звёздочка -->
      <path
        v-if="p.type === 'star'"
        d="M12 2 L14.5 9 L22 9.5 L16 14 L18 21 L12 17 L6 21 L8 14 L2 9.5 L9.5 9 Z"
        fill="currentColor"
      />
      <!-- Ромбик -->
      <path
        v-else-if="p.type === 'diamond'"
        d="M12 2 L22 12 L12 22 L2 12 Z"
        fill="currentColor"
      />
      <!-- Искра (4-конечная звезда) -->
      <path
        v-else-if="p.type === 'sparkle'"
        d="M12 2 Q13 11 22 12 Q13 13 12 22 Q11 13 2 12 Q11 11 12 2 Z"
        fill="currentColor"
      />
      <!-- Кружочек -->
      <circle
        v-else
        cx="12"
        cy="12"
        r="6"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

type ParticleType = 'star' | 'diamond' | 'sparkle' | 'circle'

interface Particle {
  id: number
  left: number
  duration: number
  delay: number
  size: number
  type: ParticleType
}

const particles = ref<Particle[]>([])

onMounted(() => {
  const types: ParticleType[] = ['star', 'diamond', 'sparkle', 'circle']
  const arr: Particle[] = []
  for (let i = 0; i < 24; i++) {
    arr.push({
      id: i,
      left: Math.random() * 100,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
      size: 10 + Math.random() * 14,
      type: types[Math.floor(Math.random() * types.length)]
    })
  }
  particles.value = arr
})
</script>

<style scoped>
.particles-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  display: none;
}

.particles-layer.active {
  display: block;
}

.particle {
  position: absolute;
  top: 100vh;
  opacity: 0;
  animation: particleFloat linear infinite;
  color: #FBBF24;
  will-change: transform, opacity;
}

/* Разные цвета по типу */
.particle.star    { color: #FBBF24; filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.7)); }
.particle.diamond { color: #A78BFA; filter: drop-shadow(0 0 6px rgba(167, 139, 250, 0.7)); }
.particle.sparkle { color: #EC4899; filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.7)); }
.particle.circle  { color: #64B5F6; filter: drop-shadow(0 0 6px rgba(100, 181, 246, 0.7)); }

@keyframes particleFloat {
  0% {
    transform: translateY(0) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  10% { opacity: 0.7; }
  50% { transform: translateY(-60vh) rotate(180deg) scale(1); }
  90% { opacity: 0.5; }
  100% {
    transform: translateY(-120vh) rotate(360deg) scale(0.8);
    opacity: 0;
  }
}
</style>