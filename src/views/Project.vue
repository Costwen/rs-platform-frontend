<template>
  <div class="contain">
    <el-container>
    <el-header class="header">
      <div class="header-left" v-if="project">
          <i class="el-icon-back" @click="back" style="margin-right:30px"/>
            <div class="description">
              <div class="actions" v-if="isEdited">
                <el-input v-model="project.name" placeholder="请输入内容" ></el-input>
                <v-icon class="icon" @click="changeName(project.id, project.name)"> mdi-content-save-edit </v-icon>
              </div>
              <span class="description-content" v-if="!isEdited">{{ project.name }}</span>
              <div @click="isEdited=true" v-if="!isEdited">
              <i class="el-icon-edit" style="fontSize:15px;color:white;opacity:1"></i>
              </div>
            </div>
      </div>

      <div class="header-right">
        <el-dropdown @command="handleCommand" trigger="click" >
          <span class="el-dropdown-link">
            <el-avatar size="medium">{{username}}</el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="toHome">个人空间</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-main class="main">
      <div class="left" v-if="leftshow">
        <div class="left-upper">
          <div class="data" v-if="project">
            <span class="left-title">项目信息</span>
            <v-divider class="divider"></v-divider>
            <div class="subtitle">
              <span>项目名称: &nbsp;</span>
              <span>{{ project.name }}</span>
            </div>
            <div class="subtitle">
              <span>项目种类: &nbsp;</span>
              <span>{{ typeMap[project.type] }}</span>
            </div>
            <div class="subtitle">
              <span>创建信息: &nbsp;</span>
              <span>{{ project.create_time }}</span>
            </div>

            <div class="subtitle">
              <span>修改时间: &nbsp;</span>
              <span>{{ project.modify_time }}</span>
            </div>
          </div>
          <div class="data" v-if="project">
            <span class="left-title">图片信息</span>
            <v-divider class="divider"></v-divider>
            <div class="left-image">
              <div class="little-title" v-if="mode === 'contrast'">图片A</div>
              <el-image
                :style="mode !== 'contrast'?'width: 200px; height: 180px;':'width: 160px; height: 140px;'"
                :src="thumbnail(project.imageA.url)"
                fit="fill">
                </el-image>
            </div>
            <div class="subtitle">
              <span style="fontSize: 15px;">H: {{ project.imageA.H }}&nbsp; W: {{ project.imageA.W }}
              </span>
            </div>
            <div v-if="mode === 'contrast'">
              <div class="left-image">
                <div class="little-title">图片B</div>
                <el-image
                  style="width: 160px; height: 140px;"
                  :src="thumbnail(project.imageB.url)"
                  fit="fill">
                </el-image>
              </div>
              <div class="subtitle">
                <span style="fontSize: 15px;">H: {{ project.imageB.H }}&nbsp; W: {{ project.imageB.W }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="left-bottom" v-if="mode !== 'contrast'">
          <v-btn class="choose" color="primary" @click="choose()" size="medium">
            选择图像
          </v-btn>
        </div>
        <div class="left-bottom2" v-else>
          <v-btn class="choose2" color="primary" @click="choose('A')"
            >选择图像A</v-btn
          >
          <v-btn class="choose2" color="primary" @click="choose('B')"
            >选择图像B</v-btn
          >
        </div>
      </div>
      <div @click="leftdisappear" class="button-left">
        <i :class="leftshow ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
      </div>
      <div v-loading="!midshow" class="mid-div">
        <double-map-card
          @addTask="addTask"
          class="mid"
          ref="doublemap"
          v-if="hasImage() && mode === 'contrast'"
        ></double-map-card>
        <map-card ref="map" class="mid" @addTask="addTask" v-if="hasImage() && mode !== 'contrast'" />
        <div v-if="!hasImage()"> 暂无图片 </div>
      </div>

      <div @click="rightdisappear" class="button-right">
        <i
          :class="rightshow ? 'el-icon-caret-right' : 'el-icon-caret-left'"
        ></i>
      </div>

      <div class="right" v-if="rightshow && project">
        <div class="right-data" v-if="project">
          <span class="right-title">任务信息</span>
          <v-divider class="divider"></v-divider>
          <div class="no-task" v-if="project.tasks.length === 0">暂无任务</div>
          <el-main class="detail">
            <div v-for="(item, index) in project.tasks" :key="index">
              <div class="task">
                <div class="task-id" >
                  <span>任务序号: &nbsp;</span>
                  <span>{{ index + 1 }}</span>
                </div>
                <div>
                  <span>任务状态: &nbsp;</span>
                  <span>
                    <i
                      class="el-icon-loading"
                      v-if="item.status === 'pending'"
                    ></i>
                    <i class="el-icon-check" v-else></i>
                  </span>
                </div>
              </div>
              <div v-if="item.status !== 'pending'">
                <v-img class="image" :src="thumbnail(item.mask.url)">
                  <el-checkbox
                    class="switch"
                    active-color="#1976d2"
                    :width="switchWidth"
                    v-show="item.status !== 'pending'"
                    v-model="visible[index]"
                    @change="setVisible(index)"
                  >
                  </el-checkbox>
                  <v-icon class="information" @click="showDetail(item)">
                    <!-- mdiInformationVariant -->
                    mdi-information-variant
                  </v-icon>
                  <v-icon  class="delete" @click="removeTask(index)">
                    <!-- mdiTrashCanOutline -->
                    mdi-trash-can-outline
                  </v-icon>
                </v-img>
              </div>
            </div>
          </el-main>
        </div>

        <div class="right-bottom">
          <v-btn class="submit" color="primary" @click="download" size="small"> 下载图片</v-btn>
          <v-btn class="submit" color="primary" @click="submit" size="small">提交任务</v-btn>
        </div>
      </div>
    </el-main>

    <choose-dialog ref="choose" @save="refresh"></choose-dialog>
    <retrieval-detail-dialog ref="retrieval"></retrieval-detail-dialog>
    <contrast-detail-dialog ref="contrast"></contrast-detail-dialog>
    <sort-detail-dialog ref="sort"></sort-detail-dialog>
    <detection-detail-dialog ref="detection"></detection-detail-dialog>
    <a id="image-download" download="map.png"></a>
  </el-container>
  </div>
</template>
<script>
import DoubleMapCard from '../components/DoubleMapCard.vue'
import ChooseDialog from '../components/Dialog/ChooseDialog.vue'
import MapCard from '../components/MapCard.vue'
import RetrievalDetailDialog from '../components/Dialog/RetrievalDetailDialog.vue'
import ContrastDetailDialog from '../components/Dialog/ContrastDetailDialog.vue'
import SortDetailDialog from '../components/Dialog/SortDetailDialog.vue'
import DetectionDetailDialog from '../components/Dialog/DetectionDetailDialog.vue'
export default {
  name: 'Project',
  components: {
    MapCard,
    ChooseDialog,
    DoubleMapCard,
    RetrievalDetailDialog,
    ContrastDetailDialog,
    SortDetailDialog,
    DetectionDetailDialog
  },
  data () {
    return {
      username: '',
      project: null,
      leftshow: true,
      rightshow: true,
      midshow: false,
      mode: null,
      fileList: [],
      url: null,
      visible: [],
      websocket: null,
      map: 'map',
      isEdited: false,
      switchWidth: 40,
      typeMap: {
        detection: '目标检测',
        sort: '地物分类',
        retrieval: '目标提取',
        contrast: '变化检测'
      },
      column: 4
    }
  },
  methods: {
    thumbnail (url) {
      if (!url) {
        return require('../assets/default.png')
      }
      return url.replace('/images/', '/thumbnail/')
    },
    getHeight () {
      if (this.project.type === 'contrast') {
        return '140px'
      }
      return '100%'
    },
    showDetail (task) {
      console.log(this.mode)
      this.$refs[this.mode].init(task)
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
          this.$api.task.getTask(data.id).then(res => {
            var task = res.data.task
            this.project.tasks.splice(i, 1, task)
            if (this.project.type === 'detection') {
              this.$refs[this.map].addLayer(task, 1.0)
            } else {
              this.$refs[this.map].addLayer(task, 0.5)
              this.$refs[this.map].addFeatures(task)
            }
            this.visible.push(true)
          })
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
        if (this.mode === 'contrast') {
          this.$refs.doublemap.map.map1.updateSize()
          this.$refs.doublemap.map.map2.updateSize()
        } else {
          this.$refs.map.map.updateSize()
        }
      })
    },
    rightdisappear () {
      this.rightshow = !this.rightshow
      this.$nextTick(() => {
        if (this.mode === 'contrast') {
          this.$refs.doublemap.map.map1.updateSize()
          this.$refs.doublemap.map.map2.updateSize()
        } else {
          this.$refs.map.map.updateSize()
        }
      })
    },
    choose (type) {
      this.$refs.choose.init(type)
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
          localStorage.removeItem('access')
          localStorage.removeItem('username')
          this.$router.push('/login')
          break
      }
    },
    setVisible (index) {
      var task = this.project.tasks[index]
      this.$refs[this.map].setVisibility(task, this.visible[index])
    },
    toTask (item) {
      if (item.status === 'pending') {
        this.$notify.error({
          message: '该任务尚未完成'
        })
      } else {
      }
    },
    changeName (id, name) {
      this.$api.project.postProject(id, {
        name: name
      }).then(res => {
        this.$notify({
          message: '修改成功',
          type: 'success'
        })
        this.isEdited = false
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          message: '修改失败',
          type: 'error'
        })
      })
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
    _download (map) {
      map.once('rendercomplete', function () {
        const mapCanvas = document.createElement('canvas')
        const size = map.getSize()
        mapCanvas.width = size[0]
        mapCanvas.height = size[1]
        const mapContext = mapCanvas.getContext('2d')
        Array.prototype.forEach.call(
          map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
          function (canvas) {
            if (canvas.width > 0) {
              const opacity =
            canvas.parentNode.style.opacity || canvas.style.opacity
              mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity)

              const backgroundColor = canvas.parentNode.style.backgroundColor
              if (backgroundColor) {
                mapContext.fillStyle = backgroundColor
                mapContext.fillRect(0, 0, canvas.width, canvas.height)
              }

              let matrix
              const transform = canvas.style.transform
              if (transform) {
                // Get the transform parameters from the style's transform matrix
                matrix = transform
                  .match(/^matrix\(([^\\(]*)\)$/)[1]
                  .split(',')
                  .map(Number)
              } else {
                matrix = [
                  parseFloat(canvas.style.width) / canvas.width,
                  0,
                  0,
                  parseFloat(canvas.style.height) / canvas.height,
                  0,
                  0
                ]
              }
              // Apply the transform to the export map context
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              )
              mapContext.drawImage(canvas, 0, 0)
            }
          }
        )
        mapContext.globalAlpha = 1
        if (navigator.msSaveBlob) {
          // link download attribute does not work on MS browsers
          navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png')
        } else {
          const link = document.getElementById('image-download')
          link.href = mapCanvas.toDataURL()
          link.click()
        }
      })
      map.renderSync()
    },
    download () {
      if (this.mode === 'contrast') {
        this._download(this.$refs.doublemap.map.map1)
        this._download(this.$refs.doublemap.map.map2)
      } else {
        this._download(this.$refs.map.map)
      }
    },
    removeTask (index) {
      var task = this.project.tasks[index]
      this.$api.task.deleteTask(task.id).then(res => {
        this.project.tasks.splice(index, 1)
        this.$refs[this.map].removeLayer(task)
        this.visible.splice(index, 1)
        this.$notify.success({
          message: '任务删除成功'
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          message: '任务删除失败'
        })
      })
    },
    submit () {
      this.$refs[this.map].submit(this.$route.params.id)
    },
    hasImage () {
      if (!this.project) return false
      if (this.project.imageA || this.project.imageB) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    // 获取url的最后一个
    this.username = localStorage.getItem('username')
    var id = this.$route.params.id
    this.$api.project.getProject(id).then((res) => {
      var project = res.data.project
      this.project = project
      this.midshow = true
      console.log(project)
      this.mode = project.type
      if (project.type === 'contrast') {
        this.map = 'doublemap'
      }
      this.$nextTick(() => {
        this.$refs[this.map].init(project)
        for (var i = 0; i < project.tasks.length; i++) {
          this.visible.push(true)
        }
      })
    })
    this.initWebSocket()
  }
}
</script>

<style scoped>
.left-title {
  color: skyblue;
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
}
.right-title {
  color: skyblue;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
}
.divider {
  margin: 10px 0 10px 0;
  border-color: skyblue;
}
.task {
  margin: 10px 0 10px 0;
  font-size: 14px;
}
.little-title {
  position: absolute;
  color: white;
  z-index: 1;
  font-size: 20pt;
  margin: 10px;
}
.header {
  display: flex;
  flex-direction: row;
  height: 50px !important;
  justify-content: space-between;
  padding-right: 0;
  background: #2f3238;
  color: aliceblue;
  align-items: center;
}
.detail {
  display: flex;
  flex-direction: column;
  max-height: 400px;
}
.detail::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: transparent;
}
.detail::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}
.detail:hover::-webkit-scrollbar-thumb {
  background: hsla(232, 73%, 84%, 0.4);
}
.detail:hover::-webkit-scrollbar-track {
  background: hsla(209, 82%, 60%, 0.1);
}
.no-task {
  text-align: center;
}
.header-left{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width:50%;
}
.header-right {
  margin-right: 30px;
}
.left-image {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.data {
  padding: 10px;
  border: 1px solid skyblue;
  margin: 15px;
  border-radius: 8px;
}
.left-data-name{
  font-size:12px;
}

.left-data-content{
  font-size:15px;
}
.left {
  background-color: #2f3238;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-container{
  /* height:  calc(100% - 50px); */
  height: 100%;
}

.main{
  height: calc(100% - 50px);
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.choose2 {
  width: 100px;
  margin: 10px;
}

.left-bottom {
  margin-bottom: 15px;
}
.right-bottom {
  align-self: center;
  margin-bottom: 15px;
}
.submit {
  width: 150px;
  margin: 10px;
}
/* 过渡动画 */
.mid {
  margin-top: 0!important;
  z-index: -1;
  height: 100%;
}

.mid-div{
  flex-grow: 1;
  height: 100%;
}
.right-data {
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
  height: 100%;
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
  height: 100vh;
  overflow-y: hidden;
  background-color: rgb(36, 39, 47);
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
  padding: 0!important;
  margin: 0 !important;
}
.el-dropdown {
  cursor: pointer;
}
.el-icon-back {
  font-size: 20px;
  cursor: pointer;
}
.image {
  margin: 10px;
  background-color: rgb(66, 62, 62);
}
.switch {
  float: left;
}
.left-bottom2 {
  align-self: center;
  margin-bottom: 15px;
}
.delete {
  float: left;
  color: skyblue;
  font-size: 20px;
}
.information {
  float: right;
  color: skyblue;
  font-size: 20px;
}

.descriptions{
  height:100%;
  width:50%;
  background-color:rgba(0,0,0,0);
}
.description{
  margin-right:10px;
  display: flex;
}
.description-name{
  margin-right:5px;
  font-size:12px;
  color:gray;
}
.description-content{
  color:white;
}
.el-icon-edit{
  cursor: pointer;
  margin-left: 10px;
}
.actions{
  display: flex
}
.icon{
  margin-left:20px;
  color: white;
}
</style>
