<template>
  <v-app>
    <project-header></project-header>
    <router-view :key="$route.fullPath"/>
  </v-app>
</template>
<script>
import ProjectHeader from './components/ProjectHeader.vue'
export default {
  components: { ProjectHeader },
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
