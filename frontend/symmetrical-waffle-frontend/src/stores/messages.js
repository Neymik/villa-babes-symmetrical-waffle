import { defineStore } from 'pinia'


export const useMessagesStore = defineStore('messages', {
  state: () => ({ 
    messages: 0, 
  }),
  getters: {
    mappedMessages: (state) => {
      return state.messages.split('\n').map((value) => {
        return value.replace('\n', '').trim()
      })
    },
  },
  actions: {
    fetchMessages() {
      this.messages = 
      `Hello hello! 👋
      Salut 😇
      Sup Sup! 🤗
      Hey hey! How's your day going?
      HI! How do you like on OF?
      Hello! First time here?
      Hey! Waiting for someone? 😏
      Excuse me, do you have the time? Nice to meet you)
      HI! Do you enjoy the content I'm making?
      Hello! Do you enjoy the content I'm making?`
    },
  },
})