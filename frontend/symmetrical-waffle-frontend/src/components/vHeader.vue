<template>
  <div class="header">
    <div>
      <h1 class="icon-close" @click="closeWindow()">X</h1>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    closeWindow() {
      const appDiv = document.getElementById('toolbar')
      appDiv.classList.add('d-none')
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

.d-none{
  display: none;
}
</style>
