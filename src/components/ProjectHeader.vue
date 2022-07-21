<template>
  <div class="header" v-if="pathMatch">
    <div class="left">
      <img src="../assets/logo3.png" class="logo" @click="toHome"/>
      <v-tabs v-model="tab" @change="change" class="item" id="headerTab">
        <v-tab>
            我的项目
        </v-tab>
        <v-tab>
          我的数据
        </v-tab>
        <v-tab>
          检索数据
        </v-tab>
      </v-tabs>
    </div>
    <div class="user">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar :size="avatarSize">{{username}}</el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="toCenter">个人空间</el-dropdown-item>
          <el-dropdown-item command="logout">注销登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectHeader',
  data () {
    return {
      tab: 0,
      bg: require('../assets/logo3.png'),
      activeIndex: 1,
      hasLogin: false,
      username: 'admin',
      avatar: '',
      id: '',
      paths: ['/home', '/dataset', '/search'],
      avatarSize: 35
    }
  },
  methods: {
    pathMatch () {
      console.log(this.$route.path)
    },
    toHome () {
      this.$router.push('/')
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    change (command) {
      var cur = this.$route.path
      var to
      switch (command) {
        case 0:
          to = '/home'
          break
        case 1:
          to = '/dataset'
          break
        case 2:
          to = '/search'
          break
      }
      if (cur !== to) {
        this.$router.push(to)
      }
    },
    goLogin () {
      this.$router.push({ path: '/login', query: { from: this.$route.path } })
    },
    logout () {
      localStorage.clear()
      // window.location.reload(false);
      this.$router.push({ path: '/login' })
      this.$notify.success({
        title: '登出成功',
        message: '欢迎下次光临'
      })
    },
    handleCommand (command) {
      switch (command) {
        case 'toHome':
          this.$router.push('/home')
          break
        case 'logout':
          localStorage.removeItem('access')
          localStorage.removeItem('username')
          this.$router.push('/login')
          break
      }
    }
  },
  mounted () {
    var path = this.$route.path
    this.tab = this.paths.indexOf(path)
    this.username = localStorage.getItem('username')
  }
}
</script>

<style scoped>

.header{
  z-index: 5;
  background-color: white;
  height: 48px !important;
  justify-content: space-between;
  display: flex;
  box-shadow: #ccc 0px 1px;
}
.logo{
  margin-right: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
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
