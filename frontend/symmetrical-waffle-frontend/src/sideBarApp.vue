<template>
  <div style="height: 82%;overflow: auto;">
    <v-header></v-header>
    <div class="answer-item" v-for="item in items" :key="item">
      <p>{{ item }}</p>
      <div class="buttons-container">
        <img 
          src="https://www.svgrepo.com/show/500521/copy-document.svg" 
          @click="copyToClipboard(item)"
        >
        <img 
          src="https://www.svgrepo.com/show/500492/chat-line-round.svg" 
          @click="copyToChat(item)"
        >
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from "@/components/vHeader.vue";
import { useMessagesStore } from '@/stores/messages'
import { useSidebarAppState } from '@/stores/sidebarAppState'
import { EventBus } from "@/common/eventBus";

export default {
  setup() {
    const messageStore = useMessagesStore()
    const sidebarAppState = useSidebarAppState()
    return { messageStore, sidebarAppState }
  },

  name: 'App',
  components: {
    vHeader
  },

  async mounted() {
    EventBus.on('messagesShow', (msg) => {
      this.items = msg
      this.sidebarAppState.isToolbarVisible = true
    })
    await new Promise(r => setTimeout(r, 2000));
    const nav = document.getElementsByClassName('l-header__menu m-native-custom-scrollbar m-scrollbar-y m-invisible-scrollbar')[0]
    const newDiv = document.createElement('div')

    newDiv.onclick = () => {
      this.sidebarAppState.isToolbarVisible = !this.sidebarAppState.isToolbarVisible
    }
    newDiv.innerHTML = '<h4 class="VB_talk">Villa talk</h4>'
    nav.append(newDiv)

  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
      }).catch(err => {
        console.error('Не удалось скопировать текст: ', err);
      });
    },
    copyToChat(){
      console.log('Failed!')
    }
  },
  computed: {
    isToolbarVisible() {
      return this.sidebarAppState.isToolbarVisible
    }
  },
  data() {
    return {
      items: [
        'h1', 'h2', 'h3', 'h4', 'h5',
      ],
    }
  },
  watch: {
    async isToolbarVisible(newValue) {
      const appDiv = document.getElementById('toolbar')
      if (newValue) {
        appDiv.classList.remove('d-none')
        await new Promise(r => setTimeout(r, 10));
        appDiv.classList.remove('w-0')
      } else {
        appDiv.classList.add('w-0')
        await new Promise(r => setTimeout(r, 500));
        appDiv.classList.add('d-none')
      }
      // newValue ? appDiv.classList.remove('w-0') : appDiv.classList.add('w-0')
      // await new Promise(r => setTimeout(r, 500));
      // newValue ? appDiv.classList.remove('d-none') : appDiv.classList.add('d-none')
    }
  }
}
</script>

<style >
#toolbar {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  position: absolute;
  background: white;
  z-index: 100;
  border: 1px solid rgba(138, 150, 163, .25);
  width: 40%;
  height: 100%;
  transition: all .5s ease-in-out;
  background-color: rgba(240, 240, 240, 0.9);
}

.VB_talk {
  color: #00aff0;
  text-align: center;
  cursor: pointer;
}

.answer-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(138, 150, 163, .25);
  padding: 10px;
}
.buttons-container{
  display: flex;
  flex-direction: column;
  justify-items: center;
  justify-content: center;
  padding: 5px;
}
.buttons-container img{
  width: 26px;
  height: 26px;
  object-fit: cover;
  cursor: pointer;
}
.buttons-container img + img{
  margin-top: 10px;
}
p{
  display: flex;
  align-items: center;
  text-align: left;
  margin: 0!important;
}
</style>