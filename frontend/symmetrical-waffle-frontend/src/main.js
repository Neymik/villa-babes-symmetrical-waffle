import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'

const app = createApp(App);
const pinia = createPinia()

let appDiv = document.getElementById('toolbar')
let i = 0
async function asyncWhile() {
  while (!appDiv && i < 10) {
    await new Promise(r => setTimeout(r, 1000));
    appDiv = document.getElementById('toolbar')
    i++
    console.log(appDiv)
  }
  app.use(pinia)
  app.mount('#toolbar');
}

asyncWhile()