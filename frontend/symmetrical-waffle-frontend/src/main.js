import { createApp } from 'vue';
import sideBarApp from '@/sideBarApp.vue';
import messageApp from '@/messageApp.vue';
import { createPinia } from 'pinia'

const SBapp = createApp(sideBarApp);
const pinia = createPinia()

let appDiv1 = document.getElementById('toolbar')
let i = 0
async function asyncWhile() {
  while (!appDiv1 && i < 10) {
    await new Promise(r => setTimeout(r, 1000));
    appDiv1 = document.getElementById('toolbar')
    i++
  }
  SBapp.use(pinia)
  SBapp.mount('#toolbar');

  let appDiv2 = document.getElementById('VB_chatBlockHolderdiv')
  let j = 0
  while (!appDiv2 && j < 10) {
    await new Promise(r => setTimeout(r, 1000));
    appDiv2 = document.getElementById('VB_chatBlockHolderdiv')
    j++
  }
  const Mapp = createApp(messageApp);

  Mapp.use(pinia)
  Mapp.mount('#VB_chatBlockHolderdiv');
}

asyncWhile()