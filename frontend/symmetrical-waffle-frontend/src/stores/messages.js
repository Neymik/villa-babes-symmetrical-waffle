import { defineStore } from 'pinia'


export const useMessagesStore = defineStore('messages', {
  state: () => ({ 
    messages: 0, 
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