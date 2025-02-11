import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appName: 'Vue 3 + Element Plus 应用',
    version: '1.0.0'
  }),
  actions: {
    updateAppName(name: string) {
      this.appName = name
    }
  }
}) 