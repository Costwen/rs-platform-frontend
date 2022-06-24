<template>
    <before-after-slider></before-after-slider>
</template>
<script>
import BeforeAfterSlider from '../components/DoubleMapCard.vue'
export default {
  name: 'Project',
  components: {
    BeforeAfterSlider
  },
  data () {
    return {
      project: null,
      leftshow: true,
      rightshow: true,
      midshow: false,
      mode: null,
      fileList: [],
      url: null,
      visible: [],
      websocket: null
    }
  },
  methods: {
    thumbnail (url) {
      return url.replace('/images/', '/thumbnail/images/')
    },
    initWebSocket () {
    // 初始化websocket
    // var wsuri = "ws://127.0.0.1:8080";
      var wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
      var wsOnLine = wsScheme + '://' + window.location.host + '/ws/chat/'
      var token = localStorage.getItem('access')
      wsOnLine = wsOnLine + '?token=' + token
      // var ws_scheme = window.location.protocol==="https:"?"wss":"ws"
      this.websock = new WebSocket(wsOnLine)
      this.websock.onopen = this.websocketonopen
      this.websock.onmessage = this.websocketonmessage
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () {
    // 连接建立之后执行send方法发送数据
      console.log('建立连接')
      var actions = {
        message: '连接测试'
      }
      this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror (e) {
      this.initWebSocket()
    },
    websocketonmessage (e) {
      var data = JSON.parse(e.data)
      var i
      for (i = 0; i < this.project.tasks.length; i++) {
        if (this.project.tasks[i].id === data.id) {
          this.project.tasks[i].status = 'finished'
          break
        }
      }
      this.$notify.success({
        message: '任务' + (i + 1) + '完成'
      })
    },
    websocketsend (Data) {
      this.websock.send(Data)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
    },

    leftdisappear () {
      this.leftshow = !this.leftshow
      this.$nextTick(() => {
        this.$refs.map.map.updateSize()
      })
    },
    rightdisappear () {
      this.rightshow = !this.rightshow
      this.$nextTick(() => {
        this.$refs.map.map.updateSize()
      })
    },
    choose () {
      this.$refs.choose.init()
    },
    back () {
      this.$router.push('/home')
    },
    handleCommand (command) {
      switch (command) {
        case 'toHome':
          this.$router.push('/home')
          break
        case 'logout':
          this.$router.push('/login')
          break
      }
    },
    setVisible (index) {
      this.$refs.map.setVisibility(index, this.visible[index])
    },
    toTask (item) {
      if (item.status === 'pending') {
        this.$notify.error({
          message: '该任务尚未完成'
        })
      } else {
      }
    },
    refresh () {
      // 重新刷新页面
      window.location.reload()
    },
    addTask (data) {
      var task = {
        id: data.id,
        status: 'pending'
      }
      this.project.tasks.push(task)
    },
    submit () {
      this.$refs.map.submit(this.$route.params.id)
    }
  },
  mounted () {
    // 获取url的最后一个
  }
}
</script>

<style scoped>
.left-title{
  color: skyblue;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
}
.right-title{
  color: skyblue;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
}
.divider{
  margin: 20px 0 20px 0;
  border-color: skyblue;
}
.task{
  margin: 20px 0 20px 0;
}
.header {
  display: flex;
  height: 50px !important;
  justify-content: space-between;
  padding-right: 0;
  background: #2f3238;
  color: aliceblue;
  align-items: center;
}
.detail{
  display: flex;
  flex-direction: column;
  max-height: 550px;
}
.no-task{
  text-align: center;
}
.header-right{
  margin-right: 30px;
}
.left-image{
  margin-bottom: 10px;
}
.data{
  padding: 10px;
  border: 1px solid skyblue;
  margin: 15px;
  border-radius: 8px;
}
.left {
  width: 200px;
  background-color: #2f3238;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
}
.choose{
  width: 200px;
}
.left-bottom{
  align-self: center;
  margin-bottom: 15px;
}
.right-bottom{
  align-self: center;
  margin-bottom: 15px;
}
.submit{
  width: 150px;
}
/* 过渡动画 */
.mid {
  z-index: -1;
  width: 100%;
  height: 100%;
}
.right-data{
  padding: 10px;
  border: 1px solid skyblue;
  margin: 15px;
  border-radius: 8px;
}
.item {
  margin: 10px;
}
.right {
  text-align: center;
  width: 180px !important;
  background-color: #2f3238;
  color: skyblue;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.subtitle {
  color: skyblue;
  font-family: Arial, Helvetica, sans-serif;
}
.button-left {
  background-color: #2f3238;
  color: skyblue;
  width: 20px;
  height: 40px;
  border: none;
  margin-top: 30px;
  cursor: pointer;
  margin-right: 10px;
}
.button-right {
  background-color: #2f3238;
  color: skyblue;
  width: 20px;
  height: 40px;
  border: none;
  margin-top: 30px;
  cursor: pointer;
  margin-left: 10px;
}
.contain {
  height: 100%;
}
.el-icon-caret-right {
  margin-top: 50%;
  font-size: 20px;
  transform: translateX(-10%);
}
.el-icon-caret-left {
  margin-top: 50%;
  font-size: 20px;
  transform: translateX(-10%);
}
.el-main {
  padding: 0;
}
.el-dropdown {
  cursor: pointer;
}
.el-icon-back {
  font-size: 20px;
  cursor: pointer;
}
.image{
  width: 100%;
  height: 100%;
  background-color: rgb(66, 62, 62);
}
.switch{
  float: left;
}
</style>
