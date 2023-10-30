import { reactive } from 'vue';

const state = reactive({
  events: {}
});

export const EventBus = {
  on(event, callback) {
    if (!state.events[event]) {
      state.events[event] = [];
    }
    state.events[event].push(callback);
  },
  emit(event, data) {
    if (state.events[event]) {
      state.events[event].forEach(callback => {
        callback(data);
      });
    }
  }
};