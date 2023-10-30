<template>
  <div>
    <v-header></v-header>
    <div class="answer-item" v-for="item in items" :key="item">
      <p>{{ item }}</p>
    </div>
  </div>
</template>

<script>
import vHeader from "@/components/vHeader.vue";
import { useMessagesStore } from '@/stores/messages'
import { useSidebarAppState } from '@/stores/sidebarAppState'
import {EventBus} from "@/common/eventBus";

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
    showPrompts() {
      return
    }
  },
  computed: {
    isToolbarVisible(){
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
    isToolbarVisible(newValue) {
      const appDiv = document.getElementById('toolbar')
      newValue ? appDiv.classList.remove('d-none') : appDiv.classList.add('d-none')
    }
  }
}
</script>

<style>
#toolbar {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  position: absolute;
  background: white;
  z-index: 100;
  border: 1px solid rgba(138,150,163,.25);;
  width: 25%;
  height: 100%;
}

.VB_talk {
  color: #00aff0;
  text-align: center;
  cursor: pointer;
}

.answer-item {
  display: flex;
}
</style>
