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
  <div class="right">
    <div @click="toUserBook" class="userbook">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAADW0lEQVR4nO3cv2sUQRjG8a8hMaBGRUsLY1QEUSGgFoqV2mmVTrDSOv4otBEr8zcYU2l6KwURRWwM2mkViJ3BKGIKTQoTE89iNtwZTHI7Ozvv3O7zgeXgduf23XtuZ2bvjgUREREREREREREREelgvcAw8BaYBxoJLvPAJDAGnCvnbUjDHuA99m943uU1cLCE98NUL80wPgFDQF+O9o0yilrDVmAQuAN8y/Y9C5yJWEPphmmGscujfcxAWm0HHtMM5YBRHcG9wx3UkGd7q0AAumiG8sqwjqDmcAeUp5tqZRkIwA6a3ddZ41qCWBkgi7S3dhdXxwPrQkKoQiCDuDomrQsJoQqB9OHqmLMuJIQqBALFj6MtXWXvQPKpciDHgHHgM/A7exzPnq81iy7rKjADXAP2At3Z43XgS7bep45Uus9CYgdyBvetQP8a6/cB08BpjzoUiEfb58ClDba5DDzzqEOBeLT9ibu6Xs9O4IdHHZpledpUcL2ZKgYyAVzYYJuLwJsItSTJYlCfxg3e/7MfNwU+5VGHxhDPtldw09sbuNlWDy6gm8DXbL1PHQqkQNujwCPc2bKYPT4EjhSoQ4EUbBuSZll1VKVAZsn3j5LvNmXai9Vl5d2Hz/bqsupGgSSmSoG0jiELwIhtOemymPbuBn4Ffl1dh7S0L6NdkoFUqcuqBAWSGAWSGAWSGAWSGAWSGAWSGAWSmDoH8tG6ACupXqn7vJ6u1OumzoFMWRdgJdUuS18uRrQb95vIehaz7Wqn6Cerna5l9R8cFoB7G7QZybZr948P+j0k5z7Kfh11WXXUCYHUdjZUlhizrO/8Oxb4LhpD2pDKGaJAEqNBPZPKGRJFJwQiganLykFnSGIUSGIUSGIUSGIUSGJiBjKAu4X3NLBMmK86Yi5RdMfaEfAB2BZxf2WYsC4ghNZP2RPgBLDZtKL2Hcb9svgHuEXcD3BpWsPoNGO42u9bFxLSSiDH/7NuivL7/hCL7+04krSEOyjfW41bWsTVviXWDmPMsmayx0Oe7S3Pop6shgHP2pM0SuePIZW45/uKftx9EBvAU+AknTfLagC3qcgsC+A87qaT1oNz0eVl6DdmtVhX6i9wd5Qexd1TdznSfkNbsi5ARERERERERERERERy+wv0OAaCFQqfxgAAAABJRU5ErkJggg=="
          width="40">
    </div>
      <div class="user">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar>{{username}}</el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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
    toUserBook () {
      this.$router.push('/userbook')
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
.right{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.userbook{
  margin-right: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.userbook:hover{
  color: #409EFF;
  background-color: #f5f5f5;
}
.el-dropdown-link{
  cursor: pointer;
}
</style>
