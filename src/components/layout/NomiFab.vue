<template>
  <Transition name="fab">
    <button
      v-if="showFab"
      v-ripple
      class="nomi-fab"
      @click="onClick"
    >
      <NomiAvatar :size="48" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import NomiAvatar from '@/components/nomi/NomiAvatar.vue'
import { vRipple } from '@/directives/ripple'

const route = useRoute()
const chat = useChatStore()

const hiddenRoutes = ['/', '/pet', '/nomi', '/onboarding']

const showFab = computed(() => {
  return !hiddenRoutes.some((p) => route.path === p || route.path.startsWith(p + '/'))
})

function onClick() {
  chat.toggle()
}
</script>

<style scoped>
.nomi-fab {
  position: fixed !important;
  right: 5vw !important;
  left: auto !important;
  bottom: calc(90px + 5vh + env(safe-area-inset-bottom)) !important;
  top: auto !important;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--grad-purple);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 28px rgba(124, 58, 237, 0.5);
  z-index: 200;
  border: none;
  padding: 0;
  overflow: visible;
}

.nomi-fab :deep(.nomi-avatar) {
  filter: none;
}

.fab-enter-active, .fab-leave-active {
  transition: all 0.25s ease;
}
.fab-enter-from, .fab-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}
</style>