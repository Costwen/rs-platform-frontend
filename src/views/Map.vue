<template>
  <div id="app">
    <OLmap />
  </div>
</template>

<script>
import OLmap from '@/components/OLmap.vue'

export default {
  name: 'app',
  components: {
    OLmap
  }
}
</script>

<style>
*{padding:0; margin:0;}
html,body{
  height: 100%;
}
#app {
  height: 100%;
}
</style>
