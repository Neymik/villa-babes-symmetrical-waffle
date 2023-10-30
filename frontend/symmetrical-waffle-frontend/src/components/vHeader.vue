<template>
  <div class="header">
    <div>
      <h1 class="icon-close" @click="closeWindow()">X</h1>
    </div>
    
  </div>
</template>

<script>
import { useSidebarAppState } from '@/stores/sidebarAppState'


export default {
  setup() {
    const sidebarAppState = useSidebarAppState()
    return {sidebarAppState}
  },
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    closeWindow() {
      this.sidebarAppState.isToolbarVisible = !this.sidebarAppState.isToolbarVisible
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon-close{
  cursor: pointer;
  width: 30px;
  margin-left: auto;
}
h1{
  padding: 5px;
  margin: 0;
}
</style>
