<!-- src/components/ui/MicButton.vue -->
<template>
  <button
    v-ripple
    class="mic-btn"
    :class="{ active: listening }"
    @click="toggle"
  >
    <AppIcon name="mic" :size="20" />
  </button>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import { vRipple } from '@/directives/ripple'

const emit = defineEmits<{ (e: 'result', text: string): void }>()

const { listening, transcript, error, start, stop } = useSpeechRecognition()
const toast = useToast()

async function toggle() {
  if (listening.value) {
    await stop()
  } else {
    await start('ru-RU')
  }
}

watch(transcript, (t) => {
  if (t) emit('result', t)
})

watch(error, (e) => {
  if (e) toast.error(e)
})
</script>

<style scoped>
.mic-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--card-bg-2);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.mic-btn.active {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: #fff;
  border-color: transparent;
  animation: micPulse 1.2s ease-in-out infinite;
}

@keyframes micPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
  50%      { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}
</style>