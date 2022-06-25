<template>
  <div class="header">
    <div class="left">
        <img src="../assets/logo3.png" class="logo" @click="toHome"/>
    </div>
      <div class="user">
        <span>
          现在开始
        </span>
      </div>
  </div>
</template>

<script>
export default {
  name: 'HomeHeader',
  data () {
    return {
      tab: 0,
      bg: require('../assets/logo3.png')
    }
  },
  methods: {
    goLogin () {
      this.$router.push({ path: '/login', query: { from: this.$route.path } })
    }
  },
  mounted () {
    var path = this.$route.path
    this.tab = this.paths.indexOf(path)
    console.log(this.tab)
  }
}
</script>

<style scoped>
.header{
  background-color: white;
  height: 50px !important;
  justify-content: space-between;
  display: flex;
}
.logo{
  margin-right: 20px;
  cursor: pointer;
}
.left{
  margin-left: 20px;
  display: flex;
}
.user{
  padding: 5px;
  margin-right: 10px;
    align-items: center;
}

.el-dropdown-link{
  cursor: pointer;
}
</style>
