<template>
  <el-container class="contain">
    <el-header class="header">
      <div class="title" v-if="project">
        <i class="el-icon-back" @click="back"></i>
      </div>

      <div class="header-right">
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            <el-avatar>用户名</el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="toHome">个人空间</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <el-aside class="left" v-if="leftshow">
        <div>
        <div class="data" v-if="project">
        <span class="left-title">项目信息</span>
        <v-divider class="divider"></v-divider>
        <div class="subtitle">
          <span>项目名称: &nbsp;</span>
          <span>{{ project.name }}</span>
        </div>
        <div class="subtitle">
          <span>项目种类: &nbsp;</span>
          <span>{{ project.type }}</span>
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
        <v-card class="left-image">
          <v-img
          :src="project.imageA"
          ></v-img>
        </v-card>
        <div class="subtitle">
          <span>图像尺寸: &nbsp;</span>
          <span>H: 0&nbsp; W: 1 </span>
        </div>
      </div>
        </div>
      <div class="left-bottom">
        <v-btn class="choose" color="primary" @click="choose">选择图像</v-btn>
      </div>
      </el-aside>
      <div @click="leftdisappear" class="button-left">
        <i :class="leftshow ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
      </div>
      <el-main v-loading="!midshow">
        <map-card ref="map" class="mid" />
      </el-main>

      <div @click="rightdisappear" class="button-right">
        <i
          :class="rightshow ? 'el-icon-caret-right' : 'el-icon-caret-left'"
        ></i>
      </div>

      <el-aside class="right" v-if="rightshow && project">
        <div class="right-data" v-if="project">
        <span class="right-title">任务信息</span>
        <v-divider class="divider"></v-divider>
        <div v-for="(item, index) in project.tasks" :key="index">
          <div class="task">
          <div class="task-id" @click="toTask(item)">
            <span>任务序号: &nbsp;</span>
            <span>{{ index+1 }}</span>
          </div>
          <div>
            <span>任务状态: &nbsp;</span>
            <span>
              <i class="el-icon-loading" v-if="item.status==='pending'"></i>
              <i class="el-icon-check" v-else></i>
            </span>
          </div>
          </div>
        </div>
        </div>
        <div class="right-bottom">
          <v-btn class="submit" color="primary" @click="choose">提交任务</v-btn>
        </div>
      </el-aside>
    </el-container>
  </el-container>
</template>
<script>
import MapCard from '../components/MapCard.vue'
export default {
  name: 'Project',
  components: {
    MapCard
  },
  data () {
    return {
      project: null,
      leftshow: true,
      rightshow: true,
      midshow: false,
      mode: null,
      fileList: [],
      url: null
    }
  },
  methods: {
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
      console.log(this.project.tasks)
    },
    back () {
      this.$router.push('/')
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
    toTask (item) {
      if (item.status === 'pending') {
        this.$notify.error({
          message: '该任务尚未完成'
        })
      } else {
        this.$router.push({
          name: 'Task',
          params: { id: item.id }
        })
      }
    }
  },
  mounted () {
    // 获取url的最后一个
    var id = this.$route.params.id
    this.$api.project.getProject(id).then((res) => {
      var project = res.data.project
      this.project = project
      this.midshow = true
      this.$refs.map.mapInit(project.imageA, 'move')
    })
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
.task-id{
  cursor: pointer;
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
</style>
