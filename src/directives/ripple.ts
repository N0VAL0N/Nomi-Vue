// src/directives/ripple.ts
import type { Directive } from 'vue'

export const vRipple: Directive<HTMLElement> = {
  mounted(el) {
    el.style.position = el.style.position || 'relative'
    el.style.overflow = 'hidden'

    el.addEventListener('pointerdown', (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      ripple.style.width = ripple.style.height = size + 'px'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'

      el.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    })
  }
}