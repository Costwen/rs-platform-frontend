<template>
  <v-app>
    <router-view :key="$route.fullPath"/>
  </v-app>
</template>
<script>
export default {
  methods: {
  }
}
</script>
<style>
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
