import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.novalon.nomi',
  appName: 'Nomi',
  webDir: 'dist',
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'DARK',
      hidden: false,
      animation: 'NONE'
    }
  }
}

export default config