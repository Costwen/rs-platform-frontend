<template>
  <div class="olmap">
    <div class="left" @click="disappear" v-if="this.show"> test </div>
    <map-card class="mid" />
    <div class="right"> </div>
  </div>
</template>

<script>
import MapCard from '../components/MapCard.vue'

export default {
  name: 'OLmap',
  components: {
    MapCard
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    disappear () {
      this.show = false
    }
  }
}
</script>

<style scoped>
.olmap{
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
}
.left{
  width: 20%;
  background-color: rgb(225, 97, 97);
  height: 100%;
}
.mid{
  flex: 1;
  height: 100%;
}
.right{
  width: 20%;
  background-color: rgb(139, 139, 208);
}
</style>
