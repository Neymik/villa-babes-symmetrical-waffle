<template>
  <div class="prompt-container">
    <button v-for="prompt in prompts" :key="prompt" @click="getAnswers()" class="prompt-item">{{ prompt }}</button>
  </div>
</template>


<script>
import {useMessagesStore} from '@/stores/messages'
import {EventBus} from "@/common/eventBus";

export default {
  setup(){
    const messagesStore = useMessagesStore()

    return{messagesStore}
  },
  data() {
    return {
      prompts: [
        'Hi👋', 'Small Q', 'Ignored',
        'Movie Hook', 'Next Msg', 'Hi Again',
        'Name Joke'
      ]
    }
  },
  methods: {
    getAnswers(){
      this.messagesStore.fetchMessages()
      const messages = this.messagesStore.mappedMessages
      EventBus.emit('messagesShow', messages)
    }
  },
}
</script>


<style>
.prompt-container{
  display: flex;
  flex-wrap: wrap;
}
.prompt-item{
  margin: 2px;
  border-width: 2px;
  border-style: solid;
  /* border-color: rgb(146, 0, 136); */
  border-image: initial;
  border-color: orange;
  padding: 5px;
}
</style>