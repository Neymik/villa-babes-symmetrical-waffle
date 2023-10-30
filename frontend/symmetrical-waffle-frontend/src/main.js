import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'

const app = createApp(App);
const pinia = createPinia()

let appDiv1 = document.getElementById('toolbar')
let i = 0
async function asyncWhile() {
  while (!appDiv1 && i < 10) {
    await new Promise(r => setTimeout(r, 1000));
    appDiv1 = document.getElementById('toolbar')
    i++
  }
  app.use(pinia)
  app.mount('#toolbar');

  let appDiv2 = document.getElementById('VB_chatBlockHolderdiv')
  let j = 0
  while (!appDiv2 && j < 10) {
    await new Promise(r => setTimeout(r, 1000));
    appDiv2 = document.getElementById('VB_chatBlockHolderdiv')
    j++
  }
  const app2 = createApp(App);

  app2.use(pinia)
  app2.mount('#VB_chatBlockHolderdiv');
}

asyncWhile()