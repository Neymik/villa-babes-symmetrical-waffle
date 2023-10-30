<template>
  <v-header></v-header>
  <div v-for="item in items" :key="item">
    item: {{ item }}
  </div>
  {{ store.count }}
</template>

<script>
import vHeader from "@/components/vHeader.vue";
import { useMessagesStore } from '@/stores/messages'

export default {

  setup(){
    const store = useMessagesStore()
    console.log(store)
    return{store}
  },
  name: 'App',
  components: {
    vHeader
  },
   async mounted() {
    await new Promise(r => setTimeout(r, 2000));
    const nav = document.getElementsByClassName('l-header__menu m-native-custom-scrollbar m-scrollbar-y m-invisible-scrollbar')[0]
    const newDiv = document.createElement('div')
    newDiv.onclick = () =>{
      const appDiv = document.getElementById('toolbar')
      appDiv.classList.remove('d-none')
    }
    newDiv.innerHTML = '<h4 class="VB_talk">Villa talk</h4>'
    nav.append(newDiv)
    
  },
  data() {
    return {
      items: [
        'h1', 'h2','h3','h4','h5',
      ]
    }
  },
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
  border: 1px solid black;
  width: 25%;
  height: 100%;
}

.VB_talk{
  color: #00aff0;
  text-align: center;
  cursor: pointer;
}
</style>
