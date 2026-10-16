// src/composables/useSpeechRecognition.ts
import { ref, onUnmounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import {
  GenAiSpeechRecognition,
  RecognitionMode
} from '@capacitor-mlkit/genai-speech-recognition'

const SILENCE_TIMEOUT = 4000 // 4 секунды молчания → стоп

export function useSpeechRecognition() {
  const listening = ref(false)
  const transcript = ref('')
  const error = ref<string | null>(null)

  // Web Speech API
  let webRecognition: any = null

  // Native listeners
  let partialListener: { remove: () => Promise<void> } | null = null
  let finalListener: { remove: () => Promise<void> } | null = null
  let errorListener: { remove: () => Promise<void> } | null = null

  // Таймер тишины
  let silenceTimer: ReturnType<typeof setTimeout> | null = null

  function resetSilenceTimer() {
    if (silenceTimer) clearTimeout(silenceTimer)
    silenceTimer = setTimeout(() => {
      stop()
    }, SILENCE_TIMEOUT)
  }

  function clearSilenceTimer() {
    if (silenceTimer) {
      clearTimeout(silenceTimer)
      silenceTimer = null
    }
  }

  // ============ WEB ============
  async function startWeb(locale: string) {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      error.value = 'Распознавание речи не поддерживается'
      return
    }
    webRecognition = new SR()
    webRecognition.lang = locale
    webRecognition.continuous = true
    webRecognition.interimResults = true

    webRecognition.onresult = (e: any) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript
      }
      transcript.value = text.trim()
      resetSilenceTimer()
    }

    webRecognition.onerror = (e: any) => {
      error.value = e.error || 'Ошибка распознавания'
      listening.value = false
      clearSilenceTimer()
    }

    webRecognition.onend = () => {
      listening.value = false
      clearSilenceTimer()
    }

    webRecognition.start()
    listening.value = true
    resetSilenceTimer()
  }

  function stopWeb() {
    try { webRecognition?.stop() } catch {}
    webRecognition = null
    listening.value = false
    clearSilenceTimer()
  }

  // ============ NATIVE ============
  async function ensureAvailable(locale = 'ru-RU'): Promise<boolean> {
    try {
      const { featureStatus } = await GenAiSpeechRecognition.checkFeatureStatus({
        locale,
        mode: RecognitionMode.Basic
      })
      if (featureStatus === 'AVAILABLE') return true
      if (featureStatus === 'DOWNLOADABLE') {
        await GenAiSpeechRecognition.downloadFeature({ locale, mode: RecognitionMode.Basic })
        return true
      }
      return false
    } catch (e) {
      console.warn('[speech] ensureAvailable failed', e)
      return false
    }
  }

  async function startNative(locale: string) {
    const perm = await GenAiSpeechRecognition.requestPermissions()
    if (perm.microphone !== 'granted') {
      error.value = 'Нет разрешения на микрофон'
      return
    }

    const ok = await ensureAvailable(locale)
    if (!ok) {
      error.value = 'Распознавание недоступно на этом устройстве'
      return
    }

    partialListener = await GenAiSpeechRecognition.addListener('partialResult', (e: any) => {
      transcript.value = e.text
      resetSilenceTimer()
    })
    finalListener = await GenAiSpeechRecognition.addListener('finalResult', (e: any) => {
      transcript.value = e.text
      resetSilenceTimer()
    })
    errorListener = await GenAiSpeechRecognition.addListener('error', (e: any) => {
      error.value = e.message
      listening.value = false
      clearSilenceTimer()
    })

    await GenAiSpeechRecognition.startRecognition({ locale, mode: RecognitionMode.Basic })
    listening.value = true
    resetSilenceTimer()
  }

  async function stopNative() {
    try { await GenAiSpeechRecognition.stopRecognition() } catch {}
    if (partialListener) await partialListener.remove()
    if (finalListener) await finalListener.remove()
    if (errorListener) await errorListener.remove()
    partialListener = null
    finalListener = null
    errorListener = null
    listening.value = false
    clearSilenceTimer()
  }

  // ============ PUBLIC ============
  async function start(locale = 'ru-RU') {
    if (listening.value) return
    error.value = null
    transcript.value = ''

    if (Capacitor.isNativePlatform()) {
      await startNative(locale)
    } else {
      await startWeb(locale)
    }
  }

  async function stop() {
    if (!listening.value) return
    if (Capacitor.isNativePlatform()) {
      await stopNative()
    } else {
      stopWeb()
    }
  }

  onUnmounted(() => {
    clearSilenceTimer()
    if (listening.value) stop()
  })

  return { listening, transcript, error, start, stop }
}