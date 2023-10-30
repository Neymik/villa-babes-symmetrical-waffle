import { defineStore } from 'pinia'


export const useSidebarAppState = defineStore('sidebarAppState', {
  state: () => ({ 
    isToolbarVisible: false,
  }),
  getters: {
    mappedMessages: (state) => {
      return state.count
    },
  },
  actions: {
    fetchMessages() {
      this.count++
    },
  },
})